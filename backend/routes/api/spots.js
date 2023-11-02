const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spots, User, SpotImage, Review, ReviewImage, Bookings,sequelize, Sequelize} = require('../../db/models');
const { Op } = require('sequelize');

const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { validationResult, body } = require('express-validator'); // Add this line


// Create a middleware to check spot ownership
const requireSpotOwnership = async (req, res, next) => {
  try {
    const { spotId } = req.params;
    const userId = req.user.id; // Assuming you have user data attached to the request

    // Check if the user is authenticated
    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

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



// GET /api/spots/search params
//get all spots
// router.get('/', requireAuth, async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const size = parseInt(req.query.size) || 20;
//     const minLat = parseFloat(req.query.minLat) || -90;
//     const maxLat = parseFloat(req.query.maxLat) || 90;
//     const minLng = parseFloat(req.query.minLng) || -180;
//     const maxLng = parseFloat(req.query.maxLng) || 180;
//     const minPrice = parseFloat(req.query.minPrice) || 0;
//     const maxPrice = parseFloat(req.query.maxPrice) || 10000;

//     const filter = {
//       where: {
//         lat: {
//           [Op.gte]: minLat,
//           [Op.lte]: maxLat,
//         },
//         lng: {
//           [Op.gte]: minLng,
//           [Op.lte]: maxLng,
//         },
//         price: {
//           [Op.gte]: minPrice,
//           [Op.lte]: maxPrice,
//         },
//       },
//     };

//     // Use Sequelize to filter spots based on the filter object
//     const spots = await Spots.findAll(filter);

//     if (req.query.page || req.query.size) {
//       // If there are search parameters, paginate the results and include page and size
//       const startIndex = (page - 1) * size;
//       const paginatedSpots = spots.slice(startIndex, startIndex + size);

//       const response = {
//         Spots: paginatedSpots,
//         page,
//         size: paginatedSpots.length,
//       };

//       res.status(200).json(response);
//     } else {
//       // If no search parameters, send all spots without page and size
//       res.status(200).json({ Spots: spots });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });
router.get('/', requireAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 20;
    const minLat = parseFloat(req.query.minLat) || -90;
    const maxLat = parseFloat(req.query.maxLat) || 90;
    const minLng = parseFloat(req.query.minLng) || -180;
    const maxLng = parseFloat(req.query.maxLng) || 180;
    const minPrice = parseFloat(req.query.minPrice) || 0;
    const maxPrice = parseFloat(req.query.maxPrice) || 10000;

    const filter = {
      where: {
        lat: {
          [Op.gte]: minLat,
          [Op.lte]: maxLat,
        },
        lng: {
          [Op.gte]: minLng,
          [Op.lte]: maxLng,
        },
        price: {
          [Op.gte]: minPrice,
          [Op.lte]: maxPrice,
        },
      },
    };

    // Use Sequelize to filter spots based on the filter object
    const spots = await Spots.findAll(filter);

    const formattedSpots = spots.map((spot) => {
      return {
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
        avgRating: 4.5, // You can set the actual value here
        previewImage: 'image url', // Set the actual URL here
      };
    });

    if (req.query.page || req.query.size) {
      // If there are search parameters, paginate the results and include page and size
      const startIndex = (page - 1) * size;
      const paginatedSpots = formattedSpots.slice(startIndex, startIndex + size);

      const response = {
        Spots: paginatedSpots,
        page,
        size: paginatedSpots.length,
      };

      res.status(200).json(response);
    } else {
      // If no search parameters, send all spots without page and size
      res.status(200).json({ Spots: formattedSpots });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//get spots of current user

router.get('/current', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    const ownedSpots = await Spots.findAll({ where: { ownerId: userId } });

    const formattedSpots = ownedSpots.map((spot) => {
      return {
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
        avgRating: 4.5,
        previewImage: 'image url',
      };
    });

    return res.status(200).json({ Spots: formattedSpots });
  } catch (error) {
    if (error.message === 'Authentication required') {
      return res.status(401).json({ message: 'Authentication required' });
    } else {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
  }
});

//create a spot
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
      };
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
      // ownerId,
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
      // createdAt: now,
      // updatedAt: now,
    });

    const formattedSpot = {
      // id: newSpot.id,
      // ownerId: newSpot.ownerId,
      address: newSpot.address,
      city: newSpot.city,
      state: newSpot.state,
      country: newSpot.country,
      lat: newSpot.lat,
      lng: newSpot.lng,
      name: newSpot.name,
      description: newSpot.description,
      price: newSpot.price,
      // createdAt: newSpot.createdAt,
      // updatedAt: new Date(),
    };

    return res.status(201).json(formattedSpot);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

//spot details from id
router.get('/:spotId', requireAuth, requireSpotOwnership, async (req, res) => {
  try {
    const spotId = req.params.spotId;

    // Find the Spot by its ID
    const spot = await Spots.findOne({
      where: { id: spotId },
      include: [
        {
          model: SpotImage,
          as: 'SpotImages',
          attributes: ['id', 'url', 'preview'],
        },
        {
          model: User,
          // as: 'Owner',
          attributes: ['id', 'firstName', 'lastName'],
        },
      ],
    });

    if (!spot) {
      // If the Spot with the specified ID is not found
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    // Format the response
    const formattedSpot = {
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
      numReviews: spot.numReviews,
      avgStarRating: 4.5,
      SpotImages: spot.SpotImages,
      Owner: spot.Owner,
    };

    // Send the formatted response
    res.status(200).json(formattedSpot);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' })
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

    // Check if the user is authorized
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const spotId = req.params.spotId;

    // Fetch the spot from the database.
    const existingSpot = await Spots.findByPk(spotId);

    if (!existingSpot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

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
router.put('/:spotId', requireAuth, async (req, res, next) => {
  // Check if the user is authorized

  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    // Get the spotId from the route parameters
    const spotId = req.params.spotId;

    // Check if the spot with the provided spotId exists
    const existingSpot = await Spots.findByPk(spotId);

    if (!existingSpot) {
      // The spot does not exist, so send a 404 error response
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    // Validate the request body fields
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
      // There are validation errors, so return a 400 Bad Request response
      return res.status(400).json({ message: 'Bad Request', errors });
    }

    // Get the owner ID from the authenticated user
    const ownerId = req.user.id;

    // Check if the authenticated user is the owner of the spot
    if (existingSpot.ownerId !== ownerId) {
      return res.status(403).json({ message: "You don't have permission to modify this spot" });
    }

    // Update the existing spot with the new data
    existingSpot.ownerId = ownerId;
    existingSpot.address = address;
    existingSpot.city = city;
    existingSpot.state = state;
    existingSpot.country = country;
    existingSpot.lat = lat;
    existingSpot.lng = lng;
    existingSpot.name = name;
    existingSpot.description = description;
    existingSpot.price = price;

    // Try to save the updated spot
    try {
      await existingSpot.save();
    } catch (error) {
      // Handle the error
      if (error instanceof SequelizeValidationError) {
        // Return a 400 Bad Request response with the validation errors
        const errors = error.errors.reduce((acc, e) => {
          acc[e.path] = e.message;
          return acc;
        }, {});

        return res.status(400).json({ message: 'Bad Request', errors });
      } else {
        // Log the error and return a 500 Internal Server Error response
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error', message: error.message });
      }
    }

    // Format the response body
    const formattedSpot = {
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
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Return a 200 OK response with the updated spot
    return res.status(200).json(formattedSpot);
  } catch (error) {
    // Handle the error
    // Send a 500 error response for all other errors
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
    })
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
router.delete('/:spotId', requireAuth, requireSpotOwnership, async (req, res) => {
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



router.get('/:spotId/reviews', requireAuth, async (req, res) => {
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
    const [existingReview, created] = await Review.findCreateFind({
      where: {
        spotId,
        userId,
      },
      defaults: {
        review: req.body.review,
        stars: req.body.stars,
      },
    });

    if (!created) {
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
    const newReview = existingReview || await Review.create({
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



router.get('/:spotId/bookings', requireAuth, requireSpotOwnership, async (req, res) => {
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


router.post('/:spotId/bookings', requireAuth, requireSpotOwnership, async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    const spotId = req.params.spotId;
    const userId = req.user.id;

    // Check if the spot exists
    const spot = await Spots.findByPk(spotId);

    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    // Check if the authenticated user is the owner of the spot
    if (spot.ownerId === userId) {
      // If the user is the owner, they can book their own spot
      const booking = await Bookings.create({
        spotId,
        userId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      });

      const currentDate = new Date();
      return res.status(200).json({
        id: booking.id,
        spotId: booking.spotId,
        userId: booking.userId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        createdAt: currentDate,
        updatedAt: currentDate,
      });
    } else {
      // If the user is not the owner, they cannot book a spot that is not theirs
      return res.status(401).json({ message: "You are not authorized to book this spot" });
    }
  } catch (error) {
    if (error instanceof Sequelize.ValidationError) {
      // Handle validation errors
      const errors = {};
      error.errors.forEach((e) => {
        errors[e.path] = e.message;
      });
      return res.status(400).json({ message: 'Bad Request', errors });
    } else {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
});
module.exports = router;
