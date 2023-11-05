const express = require('express');
const router = express.Router();
const { Review, User, Spots, ReviewImage, SpotImage } = require('../../db/models');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const requireSpotOwnership = require('../api/spots')

router.get('/current', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    const reviews = await Review.findAll({
      where: { userId },
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName'],
        },
        {
          model: Spots,
          attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],
          include: [
            {
              model: SpotImage,
              as: 'SpotImages',
              attributes: ['url'],
              where: { preview: true },
              required: false,
            },
          ],
        },
        {
          model: ReviewImage,
          attributes: ['id', 'url'],
        },
      ],
    });

    const formattedReviews = reviews.map((review) => {
      const spot = review.Spot;
      const user = review.User;
      const reviewImages = review.ReviewImages;
      const previewImage = spot.SpotImages[0];

      return {
        id: review.id,
        userId: user.id,
        spotId: spot.id,
        review: review.review,
        stars: review.stars,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
        User: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        Spot: {
          id: spot.id,
          ownerId: spot.ownerId,
          address: spot.address,
          city: spot.city,
          state: spot.state,
          country: spot.country,
          lat: spot.lat,
          lng: spot.lng,
          name: spot.name,
          price: spot.price,
          previewImage: "img-url"
        },
        ReviewImages: reviewImages,
      };
    });

    res.status(200).json({ Reviews: formattedReviews });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// POST /api/reviews/:reviewId/images
router.post('/:reviewId/images', requireAuth,   async (req, res) => {
  try {
    const reviewId = req.params.reviewId;
    const userId = req.user.id; // Assuming you have user information available via requireAuth middleware

    // Check if the review exists
    const review = await Review.findOne({
      where: {
        id: reviewId,
      },
    });

    if (!review) {
      return res.status(404).json({ message: "Review couldn't be found" });
    }

    // Check if the review belongs to the current user
    if (review.userId !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Check the maximum number of images per resource
    const imageCount = await ReviewImage.count({
      where: {
        reviewId: reviewId,
      },
    });

    if (imageCount >= 10) {
      return res.status(403).json({ message: "Maximum number of images for this resource was reached" });
    }

    // Create a new image for the review
    const { url } = req.body;
    const newImage = await ReviewImage.create({
      reviewId,
      url,
    });

    res.status(200).json({ id: newImage.id, url: newImage.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// PUT /api/reviews/:reviewId
router.put('/:reviewId', requireAuth,  async (req, res) => {
  try {
    const reviewId = req.params.reviewId;
    const userId = req.user.id;

    // Find the review by its ID and include the associated spot
    const existingReview = await Review.findByPk(reviewId, {
      include: {
        model: Spots,
      },
    });

    if (!existingReview) {
      return res.status(404).json({ message: 'Review couldn\'t be found' });
    }

    // Check if the review belongs to the current user
    if (existingReview.userId !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { review, stars } = req.body;

    if (!review) {
      return res.status(400).json({
        message: 'Bad Request',
        errors: {
          review: 'Review text is required',
          "stars": "Stars must be an integer from 1 to 5",
        },
      });
    }

    if (stars !== undefined && (!Number.isInteger(stars) || stars < 1 || stars > 5)) {
      return res.status(400).json({
        message: 'Bad Request',
        errors: {
          stars: 'Stars must be an integer from 1 to 5',
        },
      });
    }

    // Update the review
    existingReview.review = review;
    if (stars !== undefined) {
      existingReview.stars = stars;
    }
    existingReview.userId = userId;
    await existingReview.save();

    // Format the response
    const updatedAtDate = new Date(existingReview.updatedAt);

    const formattedResponse = {
      id: existingReview.id,
      userId: existingReview.userId,
      spotId: existingReview.Spot.id, // Use the Spot association to get spotId
      review: existingReview.review,
      stars: existingReview.stars,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    res.status(200).json(formattedResponse);
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE /api/reviews/:reviewId
router.delete('/:reviewId', requireAuth,  async (req, res) => {
  try {
    const reviewId = req.params.reviewId;
    const userId = req.user.id; // Assuming you have user information available via requireAuth middleware

    // Check if the review exists
    const existingReview = await Review.findOne({
      where: {
        id: reviewId,
      },
    });

    if (!existingReview) {
      return res.status(404).json({ message: "Review couldn't be found" });
    }

    // Check if the review belongs to the current user
    if (existingReview.userId !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Delete related ReviewImages
    await ReviewImage.destroy({
      where: { reviewId: reviewId },
    });

    // Delete the review
    await existingReview.destroy();

    res.status(200).json({ message: "Successfully deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
