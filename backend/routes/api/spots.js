const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spots, User, SpotImage, Review, ReviewImage, Bookings } = require('../../db/models');

const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { validationResult, body } = require('express-validator'); // Add this line


// Create a middleware to check spot ownership
const requireSpotOwnership = async (req, res, next) => {
  try {
    const { spotId } = req.params;
    const userId = req.user.id; // Assuming you have user data attached to the request

    // Check if the user owns the spot with the given spotId
    const spot = await Spots.findByPk(spotId);
    if (!spot || spot.ownerId !== userId) {
      return res.status(403).json({ message: "You don't have permission to modify this spot" });
    }

    // User owns the spot, continue to the next middleware or route handler
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};

// router.get('/', async (req, res) => {
//   try {
//     const spots = await Spots.findAll();

//     res.status(200).json({ Spots: spots });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error', message: error.message });
//   }
// });

// GET /api/spots/search params
router.get('/', async (req, res) => {
  try {
    // Parse query parameters with defaults
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 20;
    const minLat = parseFloat(req.query.minLat);
    const maxLat = parseFloat(req.query.maxLat);
    const minLng = parseFloat(req.query.minLng);
    const maxLng = parseFloat(req.query.maxLng);
    const minPrice = parseFloat(req.query.minPrice);
    const maxPrice = parseFloat(req.query.maxPrice);

    // Validate query parameters
    if (page < 1 || page > 10 || size < 1 || size > 20 ||
        (minLat && maxLat && minLat > maxLat) ||
        (minLng && maxLng && minLng > maxLng) ||
        (minPrice && minPrice < 0) ||
        (maxPrice && maxPrice < 0)) {
      return res.status(400).json({
        message: 'Bad Request',
        errors: {
          page: 'Page must be greater than or equal to 1',
          size: 'Size must be greater than or equal to 1',
          minLat: 'Minimum latitude is invalid',
          maxLat: 'Maximum latitude is invalid',
          minLng: 'Minimum longitude is invalid',
          maxLng: 'Maximum longitude is invalid',
          minPrice: 'Minimum price must be greater than or equal to 0',
          maxPrice: 'Maximum price must be greater than or equal to 0',
        },
      });
    }

    // Prepare filters based on valid query parameters
    const whereFilters = {};

    if (minLat && maxLat) {
      whereFilters.lat = { [Op.between]: [minLat, maxLat] };
    }

    if (minLng && maxLng) {
      whereFilters.lng = { [Op.between]: [minLng, maxLng] };
    }

    if (minPrice && maxPrice) {
      whereFilters.price = { [Op.between]: [minPrice, maxPrice] };
    }

    // Query the database to get spots based on filters and include SpotImages
    const spots = await Spots.findAndCountAll({
      offset: (page - 1) * size,
      limit: size,
      where: whereFilters,
      include: [
        // Include SpotImages if needed
      ],
    });

    // Prepare the response with avgRating and previewImage from SpotImages
    const response = {
      Spots: spots.rows.map(spot => ({
        id: spot.id,
        ownerId: spot.ownerId,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: spot.lat,
        lng: spot.lng,
        name: spot.name,
        description: spot.description,
        price: spot.price,
        createdAt: spot.createdAt,
        updatedAt: spot.updatedAt,
        avgRating: 4.5, // Calculate or retrieve the actual average rating
        previewImage: "image url", // Replace with the actual URL
      })),
    };

    if (Object.keys(req.query).length === 0) {
      // No search parameters, so exclude page, size, and totalCount
    } else {
      // Search parameters are provided, so include page, size, and totalCount
      response.page = page;
      response.size = size;
      response.totalCount = spots.count;
    }

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.get('/current', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id; // Assuming your authentication middleware sets req.user

    const spots = await Spots.findAll({
      where: {
        ownerId: userId,
      },
    });

    res.status(200).json({ Spots: spots });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});


router.get('/:spotId', async (req, res) => {
  const { spotId } = req.params;

  try {
    const spot = await Spots.findByPk(spotId, {
      include: [
        {
          model: SpotImage,
          as: 'SpotImages',
        },
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName'],
        },
      ],
    });

    if (!spot) {
      res.status(404).json({ message: "Spot couldn't be found" });
    } else {
      const response = {
        id: spot.id,
        ownerId: spot.ownerId,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: spot.lat,
        lng: spot.lng,
        name: spot.name,
        description: spot.description,
        price: spot.price,
        createdAt: spot.createdAt,
        updatedAt: spot.updatedAt,
        numReviews: spot.numReviews, // Assuming you have this property in your model
        avgStarRating: spot.avgStarRating, // Assuming you have this property in your model
        SpotImages: spot.SpotImages,
        Owner: spot.Owner,
      };
      res.status(200).json(response);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// Create a Spot
router.post('/', requireAuth, async (req, res) => {
  try {
    const {
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    } = req.body;

    // Validate the request body
    if (!address || !city || !state || !country || isNaN(lat) || isNaN(lng) || !name || name.length > 50 || !description || !price) {
      return res.status(400).json({
        message: 'Bad Request',
        errors: {
          address: 'Street address is required',
          city: 'City is required',
          state: 'State is required',
          country: 'Country is required',
          lat: 'Latitude is not valid',
          lng: 'Longitude is not valid',
          name: 'Name must be less than 50 characters',
          description: 'Description is required',
          price: 'Price per day is required',
          createdAt: {
            val: "CURRENT_TIMESTAMP"
          },
          updatedAt: {
            val: "CURRENT_TIMESTAMP"
          },
        },
      });
    }

    // Get the authenticated user's ID (assuming it's set by your authentication middleware)
    const ownerId = req.user.id;

    // Create a new spot in the database
    const newSpot = await Spots.create({
      ownerId,
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    });

    return res.status(201).json(newSpot);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

router.post('/:spotId/images', requireAuth, requireSpotOwnership, async (req, res) => {
  try {
    // Ensure that the URL and preview are provided in the request body
    const { url, preview } = req.body;

    if (!url || preview === undefined) {
      return res.status(400).json({
        message: 'Bad Request',
        errors: {
          url: 'URL is required',
          preview: 'Preview is required',
        },
      });
    }

    const spotId = req.params.spotId;
    // Assuming you've performed checks to ensure spotId exists and is valid

    // Create a new image in the database
    const newImage = await SpotImage.create({
      spotId,
      url,
      preview,
    });

    // Respond with the new image data
    return res.status(200).json({
      id: newImage.id,
      url: newImage.url,
      preview: newImage.preview,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});



const validateRequestBody = [
  check('address').notEmpty().withMessage('Street address is required'),
  // Add more validation checks for other fields if needed
];

router.put('/:spotId', requireAuth, validateRequestBody, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorResponse = {
      message: 'Bad Request',
      errors: {},
    };
    errors.array().forEach((error) => {
      errorResponse.errors[error.param] = error.msg;
    });
    return res.status(400).json(errorResponse);
  }

  try {
    const { spotId } = req.params;

    // Ensure that the spot exists
    const existingSpot = await Spots.findByPk(spotId);
    if (!existingSpot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    // Ensure that the current user is the owner of the spot
    const userId = req.user.id;

    if (existingSpot.ownerId !== userId) {
      return res.status(403).json({ message: "You don't have permission to modify this spot" });
    }

    // Continue with the update logic
    const {
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    } = req.body;

    // Update the spot's properties
    existingSpot.address = address;
    existingSpot.city = city;
    existingSpot.state = state;
    existingSpot.country = country;
    existingSpot.lat = lat;
    existingSpot.lng = lng;
    existingSpot.name = name;
    existingSpot.description = description;
    existingSpot.price = price;

    try {
      // Save the changes to the database
      await existingSpot.save();

      return res.status(200).json({
        id: existingSpot.id,
        ownerId: existingSpot.ownerId,
        address: existingSpot.address,
        city: existingSpot.city,
        state: existingSpot.state,
        country: existingSpot.country,
        lat: existingSpot.lat,
        lng: existingSpot.lng,
        name: existingSpot.name,
        description: existingSpot.description,
        price: existingSpot.price,
        createdAt: existingSpot.createdAt,
        updatedAt: existingSpot.updatedAt,
      });
    } catch (validationError) {
      // Handle Sequelize validation errors
      const errorResponse = {
        message: 'Bad Request',
        errors: {},
      };
      validationError.errors.forEach((error) => {
        errorResponse.errors[error.path] = error.message;
      });
      return res.status(400).json(errorResponse);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// DELETE /api/spots/:spotId
// Require Authentication: true
router.delete('/:spotId', requireAuth, async (req, res) => {
  try {
    const { spotId } = req.params;

    // Ensure that the spot exists
    const existingSpot = await Spots.findByPk(spotId, {
      include: [
        {
          model: SpotImage,
          as: 'SpotImages', // Use the alias specified in your model
        },
        User,
      ],
    });

    if (!existingSpot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    // Ensure that the current user is the owner of the spot
    const userId = req.user.id;

    if (existingSpot.User.id !== userId) {
      return res.status(403).json({ message: "You don't have permission to delete this spot" });
    }

    // Delete the spot images associated with the spot
    if (existingSpot.SpotImages) {
      for (const image of existingSpot.SpotImages) {
        await image.destroy();
      }
    }

    // Now, you can delete the spot
    await existingSpot.destroy();

    return res.status(200).json({ message: "Successfully deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});


router.get('/:spotId/reviews', async (req, res) => {
  const spotId = req.params.spotId;

  try {
      // Find the spot by ID
      const spot = await Spots.findByPk(spotId);

      if (!spot) {
          // Spot not found
          return res.status(404).json({ message: "Spot couldn't be found" });
      }

      // Find all reviews for the spot, including associated user and review images
      const reviews = await Review.findAll({
          where: { spotId },
          include: [
              {
                  model: User,
                  attributes: ['id', 'firstName', 'lastName'],
              },
              {
                  model: ReviewImage,
                  attributes: ['id', 'url'],
              },
          ],
      });

      res.status(200).json({ Reviews: reviews });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
  }
});


router.post('/:spotId/reviews', requireAuth, async (req, res) => {
  try {
    const spotId = req.params.spotId;
    const userId = req.user.id;

    // Check if the spot exists
    const spot = await Spots.findByPk(spotId);

    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    // Check if the user already has a review for this spot
    const existingReview = await Review.findOne({
      where: {
        spotId,
        userId,
      },
    });

    if (existingReview) {
      return res.status(500).json({ message: "User already has a review for this spot" });
    }

    const { review, stars } = req.body;

    if (!review || typeof stars !== 'number' || stars < 1 || stars > 5) {
      return res.status(400).json({
        message: "Bad Request",
        errors: {
          review: "Review text is required",
          stars: "Stars must be an integer from 1 to 5",
        },
      });
    }

    // Create a new review
    const newReview = await Review.create({
      spotId,
      userId,
      review,
      stars,
    });

    // Format the response as needed
    const formattedResponse = {
      id: newReview.id,
      userId: newReview.userId,
      spotId: newReview.spotId,
      review: newReview.review,
      stars: newReview.stars,
      createdAt: newReview.createdAt.toISOString(), // Convert to ISO format
      updatedAt: newReview.updatedAt.toISOString(), // Convert to ISO format
    };

    res.status(201).json(formattedResponse);
  } catch (error) {
    console.error(error);

    if (error.name === 'SequelizeValidationError') {
      const errors = {};
      error.errors.forEach((err) => {
        errors[err.path] = err.message;
      });

      res.status(400).json({
        message: 'Validation error',
        errors,
      });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
});

router.get('/:spotId/bookings', requireAuth, async (req, res) => {
  try {
    const spotId = req.params.spotId;
    const userId = req.user.id;

    // Check if the spot exists
    const spot = await Spots.findByPk(spotId);

    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    // Check if the user is the owner of the spot
    const isOwner = spot.ownerId === userId;

    // Query the database to retrieve the bookings for the spot
    const bookings = await Bookings.findAll({
      where: {
        spotId,
      },
      include: [
        {
          model: User,
          as: 'User',
        },
      ],
    });

    // Format the response based on whether the user is the owner of the spot
    if (isOwner) {
      const formattedBookings = await Promise.all(bookings.map(async (booking) => {
        const { id, userId, startDate, endDate, createdAt, updatedAt } = booking;
        const user = await User.findByPk(userId);

        return {
          User: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
          },
          id,
          spotId,
          userId,
          startDate: new Date(), // Format as "YYYY-MM-DD"
          endDate: new Date(), // Format as "YYYY-MM-DD"
          createdAt: new Date(), // Full ISO timestamp
          updatedAt: new Date(), // Full ISO timestamp
        };
      }));

      res.status(200).json({ Bookings: formattedBookings });
    } else {
      const formattedBookings = bookings.map((booking) => {
        const { startDate, endDate } = booking;

        return {
          spotId,
          startDate: startDate.toISOString().split('T')[0], // Format as "YYYY-MM-DD"
          endDate: endDate.toISOString().split('T')[0], // Format as "YYYY-MM-DD"
        };
      });

      res.status(200).json({ Bookings: formattedBookings });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

const { Op, DATE } = require('sequelize');
// Error response: Body validation errors
const bodyValidationError = {
  message: 'Bad Request',
  errors: {
    endDate: 'endDate cannot be on or before startDate',
  },
};

// Error response: Booking conflict
const bookingConflictErrorMessage = 'Sorry, this spot is already booked for the specified dates';

router.post('/:spotId/bookings', requireAuth, async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    const spotId = req.params.spotId;
    const userId = req.user.id;

    // Check if the spot exists
    const spot = await Spots.findByPk(spotId);

    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    // Check if the user is the owner of the spot
    if (spot.ownerId === userId) {
      return res.status(403).json({ message: "You cannot book your own spot" });
    }

    // Check if the spot is already booked for the specified dates
    const existingBooking = await Bookings.findOne({
      where: {
        spotId,
        [Op.or]: [
          {
            startDate: { [Op.lte]: new Date(endDate) },
            endDate: { [Op.gte]: new Date(startDate) },
          },
          {
            startDate: { [Op.lte]: new Date(endDate) },
            endDate: { [Op.gte]: new Date(startDate) },
          },
        ],
      },
    });

    if (existingBooking) {
      return res.status(403).json({
        message: "Sorry, this spot is already booked for the specified dates",
        errors: {
          startDate: "Start date conflicts with an existing booking",
          endDate: "End date conflicts with an existing booking"
        }
      });
    }

    // Check if endDate is on or before startDate
    if (new Date(endDate) <= new Date(startDate)) {
      return res.status(400).json({
        message: "Bad Request",
        errors: {
          endDate: "endDate cannot be on or before startDate"
        }
      });
    }

    // Create the booking
    const booking = await Bookings.create({
      spotId,
      userId,
      startDate,
      endDate,
    });

    const currentDate = new Date().toISOString();
    res.status(200).json({
      id: booking.id,
      spotId: booking.spotId,
      userId: booking.userId,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      createdAt: currentDate,
      updatedAt: currentDate,
    });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      // Handle validation errors
      const errors = {};
      error.errors.forEach((e) => {
        errors[e.path] = e.message;
      });
      res.status(400).json({ message: 'Bad Request', errors });
    } else {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
});

module.exports = router;
