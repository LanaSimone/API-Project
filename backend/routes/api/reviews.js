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
      return res.status(403).json({ message: "You are not authorized to add images to this review" });
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
      return res.status(403).json({ message: "You don't have permission to edit this review" });
    }

    // Validate the request body
    if (!review) {
      return res.status(400).json({
        message: 'Bad Request',
        errors: {
          review: 'Review text is required',
        },
      });
    }
    if (!Number.isInteger(stars) || stars < 1 || stars > 5) {
      return res.status(400).json({
        message: 'Bad Request',
        errors: {
          stars: 'Stars must be an integer from 1 to 5',
        },
      });
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
      createdAt: new Date(),
      updatedAt: new Date(), // Format updatedAt as an ISO string
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE /api/reviews/:reviewId
router.delete('/:reviewId', requireAuth, async (req, res) => {
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
      return res.status(403).json({ message: "You are not authorized to delete this review" });
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