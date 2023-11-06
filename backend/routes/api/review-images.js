const express = require('express');
const router = express.Router();
const { Review, ReviewImage, Spots } = require('../../db/models');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const requireSpotOwnership = require('../api/spots')
const bcrypt = require('bcryptjs');


// const requireSpotOwnership = async (req, res, next) => {
//   try {
//     const { spotId } = req.params;
//     const userId = req.user.id; // Assuming you have user data attached to the request

//     // Check if the user is authenticated
//     if (!userId) {
//       return res.status(401).json({ message: "Authentication required" });
//     }

//     // Check if the user owns the spot with the given spotId
//     const spot = await Spots.findByPk(spotId);
//     if (!spot || spot.ownerId !== userId) {
//       return res.status(403).json({ message: "You don't have permission to modify this spot" });
//     }

//     // User owns the spot, continue to the next middleware or route handler
//     next();
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: 'Internal Server Error', message: error.message });
//   }
// };

// DELETE /api/review-images/:imageId
router.delete('/:imageId', requireAuth,  async (req, res) => {
    try {
      const imageId = req.params.imageId;
      const userId = req.user.id;

      // Check if the review image exists
      const reviewImage = await ReviewImage.findByPk(imageId, {
        include: Review,
      })

      if (!reviewImage) {
        return res.status(404).json({ message: "Review Image couldn't be found" });
      }

      // Check if the user is the owner of the review associated with the image
      if (reviewImage.Review.userId !== userId) {
        return res.status(403).json({ message: 'Forbidden' });
      };

      // Delete the review image
      await reviewImage.destroy();

      res.status(200).json({ message: 'Successfully deleted' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  })

  module.exports = router;
