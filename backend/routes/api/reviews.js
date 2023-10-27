const express = require('express');
const router = express.Router();
const { Review, User, Spots, ReviewImage } = require('../../db/models');
const { setTokenCookie, requireAuth } = require('../../utils/auth');

router.get('/current', requireAuth, async (req, res) => {
  try {
    const reviews = await Review.findAll({
        include: [
            {
              model: User,
              attributes: ['id', 'firstName', 'lastName'],
            },
            {
              model: Spots,
              attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],
            },
            {
              model: ReviewImage, // Include the ReviewImage model for images
              attributes: ['id', 'url'],
            },
          ],
        });

      res.status(200).json({ Reviews: reviews });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// POST /api/reviews/:reviewId/images
router.post('/:reviewId/images', requireAuth, async (req, res) => {
  try {
    const reviewId = req.params.reviewId;
    const userId = req.user.id; // Assuming you have user information available via requireAuth middleware

    // Check if the review exists and belongs to the current user
    const review = await Review.findOne({
      where: {
        id: reviewId,
        userId: userId,
      },
    });

    if (!review) {
      return res.status(404).json({ message: "Review couldn't be found" });
    }

    // Check the maximum number of images per resource
    const imageCount = await ReviewImage.count({
      where: {
        reviewId: reviewId,
      },
    });

    if (imageCount >= 10) {
      return res.status(403).json({ message: "Maximum number of images for this review was reached" });
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
router.put('/:reviewId', requireAuth, async (req, res) => {
  try {
    const reviewId = req.params.reviewId;
    const userId = req.user.id; // Assuming you have user information available via requireAuth middleware

    const { review, stars } = req.body;

    // Check if the review exists and belongs to the current user
    const existingReview = await Review.findOne({
      where: {
        id: reviewId,
        userId: userId,
      },
    });

    if (!existingReview) {
      return res.status(404).json({ message: "Review couldn't be found" });
    }

    // Update the review
    existingReview.review = review;
    existingReview.stars = stars;
    await existingReview.save();

    // Convert updatedAt to a Date object before calling toISOString
    const updatedAtDate = new Date(existingReview.updatedAt);

    res.status(200).json({
      id: existingReview.id,
      userId: existingReview.userId,
      spotId: existingReview.spotId,
      review: existingReview.review,
      stars: existingReview.stars,
      createdAt: existingReview.createdAt.toISOString(),
      updatedAt: updatedAtDate.toISOString(), // Format updatedAt as an ISO string
    });
  } catch (error) {
    console.error(error);

    // Handle validation errors
    if (error.name === 'SequelizeValidationError') {
      const errors = {};
      error.errors.forEach((err) => {
        errors[err.path] = err.message;
      });

      res.status(400).json({
        message: 'Bad Request',
        errors,
      });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
});

// DELETE /api/reviews/:reviewId
router.delete('/:reviewId', requireAuth, async (req, res) => {
  try {
    const reviewId = req.params.reviewId;
    const userId = req.user.id; // Assuming you have user information available via requireAuth middleware

    // Check if the review exists and belongs to the current user
    const existingReview = await Review.findOne({
      where: {
        id: reviewId,
        userId: userId,
      },
    });

    if (!existingReview) {
      return res.status(404).json({ message: "Review couldn't be found" });
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
