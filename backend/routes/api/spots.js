const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spots, User, SpotImage } = require('../../db/models');

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

router.get('/', async (req, res) => {
  try {
    const spots = await Spots.findAll();

    res.status(200).json({ Spots: spots });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
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

module.exports = router;
