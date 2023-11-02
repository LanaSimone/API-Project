const express = require('express');
const router = express.Router();
const {  Bookings, Spots, User, SpotImage } = require('../../db/models');
const moment = require('moment');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { validationResult, body } = require('express-validator'); // Add this line



const requireSpotOwnership = async (req, res, next) => {
  try {
    const { spotId } = req.params;
    const userId = req.user.id; // Assuming you have user data attached to the request

    // Check if the user is authenticated
    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

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
        const previewImage = 'img-url' // Assuming you want the first URL

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

  // PUT /api/bookings/:bookingId update bookings
  router.put('/:bookingId', requireAuth, async (req, res) => {
    try {
      const { startDate, endDate } = req.body;
      const bookingId = req.params.bookingId;
      const userId = req.user.id;

      // Check if the booking exists
      const booking = await Bookings.findByPk(bookingId);

      if (!booking) {
        return res.status(404).json({ message: "Booking couldn't be found" })
      }

      const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);


      // Check if the booking belongs to the current user
      if (booking.userId !== userId) {
        return res.status(403).json({ message: "You are not authorized to edit this booking" });
      }

      // Check if the booking is in the past (endDate is before the current date)
      if (new Date(booking.endDate) < new Date()) {
        return res.status(403).json({ message: "Past bookings can't be modified" });
      }

      // Check if either startDate or endDate is in the past
      const currentDate = new Date();
      if (new Date(startDate) < currentDate || new Date(endDate) < currentDate) {
        return res.status(403).json({ message: "Past bookings can't be modified" });
      }

      // Check for booking conflicts (including the current booking)
      const existingBookings = await Bookings.findAll({
        where: {
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

      // Check if end date comes before start date
      if (new Date(endDate) <= new Date(startDate)) {
        return res.status(400).json({
          message: "Bad Request",
          errors: {
            endDate: "End date cannot come before or be equal to startDate",
          },
        });
      }

      // Check if either startDate or endDate is during an existing booking
      if (existingBookings.some(existingBooking => {
        const existingStartDate = new Date(existingBooking.startDate);
        const existingEndDate = new Date(existingBooking.endDate);
        return (
          (startDateObj >= existingStartDate && startDateObj <= existingEndDate) ||
          (endDateObj >= existingStartDate && endDateObj <= existingEndDate)
        );
      })) {
        return res.status(403).json({
          message: "Booking conflicts with an existing booking",
          errors: {
            "startDate": "Start date is during an existing booking",
            "endDate": "End date is during an existing booking",
          },
        });
      }

      // Check if start date and end date surround an existing booking
      if (existingBookings.some(existingBooking => {
        const existingStartDate = new Date(existingBooking.startDate);
        const existingEndDate = new Date(existingBooking.endDate);
        return startDateObj <= existingStartDate && endDateObj >= existingEndDate;
      })) {
        return res.status(403).json({
          message: "Booking conflicts with an existing booking",
          errors: {
            "startDate": "Start date surrounds an existing booking",
            "endDate": "End date surrounds an existing booking",
          },
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
