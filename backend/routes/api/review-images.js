const express = require('express');
const router = express.Router();
const { Review, ReviewImage } = require('../../db/models');
const { setTokenCookie, requireAuth } = require('../../utils/auth');

const bcrypt = require('bcryptjs');




// DELETE /api/review-images/:imageId
router.delete('/:imageId', requireAuth, async (req, res) => {
    try {
      const imageId = req.params.imageId;
      const userId = req.user.id;

      // Check if the review image exists
      const reviewImage = await ReviewImage.findByPk(imageId, {
        include: Review,
      });

      if (!reviewImage) {
        return res.status(404).json({ message: "Review Image couldn't be found" });
      }

      // Check if the user is the owner of the review associated with the image
      if (reviewImage.Review.userId !== userId) {
        return res.status(403).json({ message: 'You are not authorized to delete this review image' });
      }

      // Delete the review image
      await reviewImage.destroy();

      res.status(200).json({ message: 'Successfully deleted' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  module.exports = router;
