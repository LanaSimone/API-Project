const express = require('express');
const router = express.Router();
const { Review, User, Spot, ReviewImage } = require('../../db/models');
const { setTokenCookie, requireAuth } = require('../../utils/auth');

router.get('/current', requireAuth, async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: {
        userId: req.user.id, // Filter by the current user's ID
      },
      include: [
        User, // Include the User model
        Spot, // Include the Spot model
        ReviewImage, // Include ReviewImage if needed
      ],
    });

    // Your response logic here
    res.status(200).json({ Reviews: reviews });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
