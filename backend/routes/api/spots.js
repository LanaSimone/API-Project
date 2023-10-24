const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spots, Users, SpotImages } = require('../../db/models');

const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');



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
          model: SpotImages,
          as: 'SpotImages',
        },
        {
          model: Users,
          as: 'Owner',
          attributes: ['id', 'firstName', 'lastName'],
        },
      ],
    });

    if (!spot) {
      res.status(404).json({ message: "Spot couldn't be found" });
    } else {
      res.status(200).json(spot);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});
module.exports = router;
