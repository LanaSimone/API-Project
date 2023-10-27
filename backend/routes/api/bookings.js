const express = require('express');
const router = express.Router();
const {  Bookings, Spots, User, SpotImage } = require('../../db/models');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { validationResult, body } = require('express-validator'); // Add this line


router.get('/current', requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;

      const bookings = await Bookings.findAll({
        where: { userId },
        include: [
          {
            model: Spots,
            as: 'Spot', // Specify the alias
            include: {
              model: SpotImage,
              as: 'SpotImages', // Specify the alias for SpotImage
            },
          },
        ],
      });

      const formattedBookings = bookings.map((booking) => {
        const { id, spotId, startDate, endDate, createdAt, updatedAt, Spot } = booking;
        const { ownerId, address, city, state, country, lat, lng, name, price, SpotImages } = Spot;
        const previewImage = SpotImages[0]?.url; // Assuming you want the first URL

        return {
          id,
          spotId,
          Spot: {
            id: spotId,
            ownerId,
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            price,
            previewImage,
          },
          userId,
          startDate,
          endDate,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      });

      res.status(200).json({ Bookings: formattedBookings });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

const { Op } = require('sequelize');

  // PUT /api/bookings/:bookingId
router.put('/:bookingId', requireAuth, async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    const bookingId = req.params.bookingId;
    const userId = req.user.id;

    // Check if the booking exists
    const booking = await Bookings.findByPk(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking couldn't be found" });
    }

    // Check if the booking belongs to the current user
    if (booking.userId !== userId) {
      return res.status(403).json({ message: "You are not authorized to edit this booking" });
    }

    // Check if the booking is in the past (endDate is before the current date)
    if (new Date(booking.endDate) < new Date()) {
      return res.status(403).json({ message: "Past bookings can't be modified" });
    }

    // Check if the spot is already booked for the specified dates
    const existingBooking = await Bookings.findOne({
      where: {
        id: { [Op.not]: bookingId },
        spotId: booking.spotId,
        [Op.or]: [
          {
            startDate: { [Op.lte]: new Date(endDate) },
            endDate: { [Op.gte]: new Date(startDate) },
          },
          {
            startDate: { [Op.lte]: new Date(endDate) },
            endDate: { [Op.gte]: new Date(startDate) },
          },
        ],
      },
    });

    // Error response: Booking conflict
if (existingBooking) {
  return res.status(403).json({
    message: "Sorry, this spot is already booked for the specified dates",
    errors: {
      startDate: "Start date conflicts with an existing booking",
      endDate: "End date conflicts with an existing booking"
    }
  });
}

    if (existingBooking) {
      return res.status(403).json({
        message: "Sorry, this spot is already booked for the specified dates",
        errors: {
          startDate: "Start date conflicts with an existing booking",
          endDate: "End date conflicts with an existing booking"
        }
      });
    }

    // Check if endDate comes before startDate
    if (new Date(endDate) < new Date(startDate)) {
      return res.status(400).json({
        message: "Bad Request",
        errors: {
          endDate: "endDate cannot come before startDate"
        }
      });
    }

    // Update the booking
    await booking.update({
      startDate,
      endDate,
    });

    // Return the updated booking
    res.status(200).json({
      id: booking.id,
      spotId: booking.spotId,
      userId: booking.userId,
      startDate: booking.startDate,
      endDate: booking.endDate,
      createdAt: booking.createdAt,
      updatedAt: new Date(),
    });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      // Handle validation errors
      const errors = {};
      error.errors.forEach((e) => {
        errors[e.path] = e.message;
      });
      res.status(400).json({ message: 'Bad Request', errors });
    } else {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
});


// Delete a Booking
router.delete('/:bookingId', requireAuth, async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    const userId = req.user.id;

    // Check if the booking exists
    const booking = await Bookings.findByPk(bookingId, {
      include: Spots,
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking couldn't be found" });
    }

    // Check if the booking belongs to the current user or if the spot belongs to the current user
    if (booking.userId !== userId && booking.Spot.ownerId !== userId) {
      return res.status(403).json({ message: "You are not authorized to delete this booking" });
    }

    // Check if the booking has already started (endDate is before the current date)
    const currentDate = new Date();
    if (new Date(booking.endDate) < currentDate) {
      return res.status(403).json({ message: "Bookings that have been started can't be deleted" });
    }

    // Delete the booking
    await booking.destroy();

    res.status(200).json({ message: "Successfully deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
