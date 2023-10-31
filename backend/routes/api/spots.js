const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spots, User, SpotImage, Review, ReviewImage, Bookings,sequelize } = require('../../db/models');

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

    let response = {}; // Define the response object

    // Remove the validation check for parameters if none are provided
    if (
      ((req.query.hasOwnProperty('page') && parseInt(req.query.page) <= 0) ||
      (req.query.hasOwnProperty('size') && parseInt(req.query.size) <= 0)) ||
      ((req.query.hasOwnProperty('minLat') && minLat > maxLat) ||
      (req.query.hasOwnProperty('minLng') && minLng > maxLng) ||
      (req.query.hasOwnProperty('minPrice') && minPrice < 0) ||
      (req.query.hasOwnProperty('maxPrice') && maxPrice < 0))
    ) {
      return res.status(400).json({
        message: 'Bad Request',
        errors: {
          page: 'Page must be greater or equal to 1',
          size: 'Size must be greater or equal to 1',
          minLat: 'Minimum latitude is invalid',
          maxLat: 'Maximum latitude is invalid',
          minLng: 'Minimum longitude is invalid',
          maxLng: 'Maximum longitude is invalid',
          minPrice: 'Minimum price must be greater than or equal to 0',
          maxPrice: 'Maximum price must be greater than or equal to 0',
        },
      });
    }

    if (Object.keys(req.query).length === 0) {
      // No search parameters, so exclude page, size, and totalCount
    } else {
      // Search parameters are provided, so include page, size, and totalCount
      response.page = page;
      response.size = size;
      response.totalCount = Spots.count;
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

    const errors = {};

    function validateField(value, fieldName, errorMessage) {
      if (!value || value.trim() === '') {
        errors[fieldName] = errorMessage;
      }
    }

    function validateNumericField(value, fieldName, errorMessage) {
      if (isNaN(value)) {
        errors[fieldName] = errorMessage;
      }
    }

    validateField(address, 'address', 'Street address is required');
    validateField(city, 'city', 'City is required');
    validateField(state, 'state', 'State is required');
    validateField(country, 'country', 'Country is required');
    validateNumericField(lat, 'lat', 'Latitude is not valid');
    validateNumericField(lng, 'lng', 'Longitude is not valid');

    if (!name || name.trim() === '') {
      errors.name = 'Name is required';
    } else if (name.length > 50) {
      errors.name = 'Name must be less than 50 characters';
    }

    validateField(description, 'description', 'Description is required');

    if (price === undefined) {
      errors.price = 'Price per day is required';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        message: 'Bad Request',
        errors,
      });
    }

    const ownerId = req.user.id;
    const now = new Date();

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
      createdAt: now,
      updatedAt: now,
    });

    const formattedSpot = {
      id: newSpot.id,
      ownerId: newSpot.ownerId,
      address: newSpot.address,
      city: newSpot.city,
      state: newSpot.state,
      country: newSpot.country,
      lat: newSpot.lat,
      lng: newSpot.lng,
      name: newSpot.name,
      description: newSpot.description,
      price: newSpot.price,
      createdAt: newSpot.createdAt,
      updatedAt: new Date(),
    };

    return res.status(201).json(formattedSpot);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});
//create a spot image
router.post('/:spotId/images', requireAuth, async (req, res) => {
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

    // Fetch the spot from the database.
    const existingSpot = await Spots.findByPk(spotId);

    if (!existingSpot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    // If you want to check spot ownership, you can do it here.
    // You can compare the owner's ID from the existingSpot with the authenticated user's ID.

    // Assuming you have req.user set by the requireAuth middleware
    if (existingSpot.ownerId !== req.user.id) {
      return res.status(403).json({ message: "You don't have permission to modify this spot" });
    }

    // Create a new image in the database associated with the spot
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
//update spot
router.put('/:spotId', requireAuth, async (req, res) => {
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

    const errors = {};

    if (!address) {
      errors.address = 'Street address is required';
    }

    if (!city) {
      errors.city = 'City is required';
    }

    if (!state) {
      errors.state = 'State is required';
    }

    if (!country) {
      errors.country = 'Country is required';
    }

    if (isNaN(lat)) {
      errors.lat = 'Latitude is not valid';
    }

    if (isNaN(lng)) {
      errors.lng = 'Longitude is not valid';
    }

    if (!name || name.length > 50) {
      errors.name = 'Name must be less than 50 characters';
    }

    if (!description) {
      errors.description = 'Description is required';
    }

    if (price === undefined) {
      errors.price = 'Price per day is required';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        message: 'Bad Request',
        errors,
      });
    }

    const ownerId = req.user.id;
    const now = new Date();

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
      createdAt: now,
      updatedAt: now,
    });

    const formattedSpot = {
      id: newSpot.id,
      ownerId: newSpot.ownerId,
      address: newSpot.address,
      city: newSpot.city,
      state: newSpot.state,
      country: newSpot.country,
      lat: newSpot.lat,
      lng: newSpot.lng,
      name: newSpot.name,
      description: newSpot.description,
      price: newSpot.price,
      createdAt: newSpot.createdAt,
      updatedAt: new Date(),
    };

    return res.status(201).json(formattedSpot);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});


async function deleteOrphanedBookings() {
  // Get all of the bookings that are not associated with any spots.
  const orphanedBookings = await Bookings.findAll({ where: { spotId: null } });

  // Delete the orphaned bookings.
  await Bookings.destroy({ where: { id: orphanedBookings.map((booking) => booking.id) } });
}
// DELETE /api/spots/:spotId
// Require Authentication: true
//  router.delete('/:spotId', requireSpotOwnership, requireAuth, async (req, res) => {

//   const t = await sequelize.transaction();

//   try {
//     const { spotId, userId } = req.params;

//     // Fetch the spot from the database.
//     const existingSpotPromise = Spots.findByPk(spotId);

//     // Delete orphaned bookings.
//     await deleteOrphanedBookings();

//     // Wait for the spot to be fetched.
//     const existingSpot = await existingSpotPromise;

//     if (!existingSpot) {
//       return res.status(404).json({ message: "Spot couldn't be found" });
//     }

//     if (existingSpot.ownerId !== userId) {
//       return res.status(403).json({ message: "You don't have permission to delete this spot" });
//     }

//     // Delete associated spot images.
//     await SpotImage.destroy({ where: { spotId: spotId }, transaction: t });

//     // Delete the spot and its associated bookings.
//     await existingSpot.destroy({
//       transaction: t,
//       afterDestroy: async (spot) => {
//         await Bookings.destroy({ where: { spotId: spot.id }, transaction: t });
//       },
//     });

//     await t.commit();

//     return res.status(200).json({ message: "Successfully deleted" });
//   } catch (error) {
//     console.error(error);
//     if (t) {
//       await t.rollback();
//     }
//     return res.status(500).json({ error: 'Internal Server Error', message: error.message });
//   }
// });

// router.delete('/:spotId', requireAuth, requireSpotOwnership, async (req, res) => {
//   const t = await sequelize.transaction();

//   try {
//     const { spotId } = req.params;

//     // Fetch the spot from the database.
//     const existingSpot = await Spots.findByPk(spotId);

//     if (!existingSpot) {
//       console.log("Spot couldn't be found");
//       return res.status(404).json({ message: "Spot couldn't be found" });
//     }

//     // Delete associated reviews and their images.
//     const reviews = await Review.findAll({ where: { spotId } });

//     for (const review of reviews) {
//       // Delete associated review images.
//       await ReviewImage.destroy({ where: { reviewId: review.id }, transaction: t });
//     }

//     // Delete the reviews themselves.
//     await Review.destroy({ where: { spotId }, transaction: t });

//     // Delete associated spot images.
//     const deletedSpotImages = await SpotImage.destroy({ where: { spotId }, transaction: t });

//     // Delete associated bookings.
//     const deletedBookings = await Bookings.destroy({ where: { spotId }, transaction: t });

//     // Now you can safely delete the spot.
//     const deletedSpot = await existingSpot.destroy({ transaction: t });

//     await t.commit();

//     return res.status(200).json({ message: "Successfully deleted" });
//   } catch (error) {
//     console.error(error);
//     if (t) {
//       await t.rollback();
//     }
//     return res.status(500).json({ error: 'Internal Server Error', message: error.message });
//   }
// });

// Define the DELETE route without the "requireSpotOwnership" middleware at first
router.delete('/:spotId', requireAuth, async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { spotId } = req.params;

    // Fetch the spot from the database.
    const existingSpot = await Spots.findByPk(spotId, {
      include: [
        {
          model: Review,
          include: ReviewImage, // Include review images
        },
        {
          model: Bookings,
        },
        {
          model: SpotImage,
          as: 'SpotImages', // Include spot images using the alias
        },
      ],
    });

    if (!existingSpot) {
      await t.rollback();
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    // Check if the user owns the spot.
    if (existingSpot.ownerId !== req.user.id) {
      await t.rollback();
      return res.status(403).json({ message: "You don't have permission to modify this spot" });
    }

    // Delete associated reviews and their images.
    for (const review of existingSpot.Reviews) {
      // Delete review images.
      for (const reviewImage of review.ReviewImages) {
        await reviewImage.destroy({ transaction: t });
      }
      await review.destroy({ transaction: t });
    }

    // Delete associated bookings.
    for (const booking of existingSpot.Bookings) {
      await booking.destroy({ transaction: t });
    }

    // Delete spot images.
    for (const spotImage of existingSpot.SpotImages) {
      await spotImage.destroy({ transaction: t });
    }

    // Delete the spot itself.
    await existingSpot.destroy({ transaction: t });

    // Commit the transaction after successful deletion.
    await t.commit();

    return res.status(200).json({ message: "Successfully deleted" });
  } catch (error) {
    console.error(error);
    if (t) {
      await t.rollback();
    }
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
      return res.status(400).json({ message: "User already has a review for this spot" });
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

    // Check if any reviews exist for this spot
    const spotReviews = await Review.findAll({
      where: {
        spotId,
      },
    });

    if (spotReviews.length === 0) {
      return res.status(404).json({ message: "No reviews exist for this spot" });
    }

    // Create a new review
    const newReview = await Review.create({
      spotId,
      userId,
      review,
      stars,
    });

    // Respond with the newly created review
    return res.status(201).json({
      id: newReview.id,
      userId: newReview.userId,
      spotId: newReview.spotId,
      review: newReview.review,
      stars: newReview.stars,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error(error);

    if (error.name === 'SequelizeValidationError') {
      const errors = {};
      error.errors.forEach((err) => {
        errors[err.path] = err.message;
      });

      return res.status(400).json({
        message: 'Validation error',
        errors,
      });
    } else {
      return res.status(500).json({ message: 'Internal server error' });
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

    // Check if startDate is in the past
    if (new Date(startDate) < new Date()) {
      return res.status(400).json({
        message: "Bad Request",
        errors: {
          startDate: "startDate cannot be in the past"
        }
      });
    }

    // Create the booking
    const booking = await Bookings.create({
      spotId,
      userId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    });

    const currentDate = new Date();
    res.status(200).json({
      id: booking.id,
      spotId: booking.spotId,
      userId: booking.userId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
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
