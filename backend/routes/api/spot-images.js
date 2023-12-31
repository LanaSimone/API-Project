const express = require('express');
const router = express.Router();
const { Bookings, Spots, User, SpotImage } = require('../../db/models');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const requireSpotOwnership = require('../api/spots')
const bcrypt = require('bcryptjs');

// DELETE /api/spot-images/:imageId
router.delete('/:imageId', requireAuth,  async (req, res) => {
    try {
      const imageId = req.params.imageId;
      const userId = req.user.id;

      // Check if the spot image exists
      const spotImage = await SpotImage.findByPk(imageId, {
        include: Spots,
      });

      if (!spotImage) {
        return res.status(404).json({ message: 'Spot Image couldn\'t be found' });
      }

      // Check if the user is the owner of the spot associated with the image
      if (spotImage.Spot.ownerId !== userId) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      // Delete the spot image
      await spotImage.destroy();

      res.status(200).json({ message: 'Successfully deleted' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });


module.exports = router;
