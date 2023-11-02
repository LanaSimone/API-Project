const express = require('express');
const router = express.Router();
const {  Bookings, Spots, User, SpotImage } = require('../../db/models');
const moment = require('moment');
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
        return res.status(404).json({ message: "Booking couldn't be found" });
      }

      // Check if the booking belongs to the current user
      if (booking.userId !== userId) {
        return res.status(403).json({ message: "You are not authorized to edit this booking" });
      }

      // Convert the input dates to Date objects
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);

      // Check if start date and end date are the same
      if (startDateObj.getTime() === endDateObj.getTime()) {
        return res.status(400).json({ message: "Bad Request", errors: { "startDate": "Start date and end date cannot be the same" } });
      }

      // Check if end date is before start date
      if (startDateObj >= endDateObj) {
        return res.status(400).json({ message: "Bad Request", errors: { "endDate": "End date cannot be before start date" } });
      }

      // Check if start date and end date are in the past
      const currentDate = new Date();
      if (startDateObj < currentDate || endDateObj < currentDate) {
        return res.status(400).json({ message: "Bad Request", errors: { "startDate": "Dates cannot be in the past", "endDate": "Dates cannot be in the past" } });
      }

      // Check for booking conflicts (including the current booking)
      const existingBookings = await Bookings.findAll({
        where: {
          spotId: booking.spotId,
          [Op.or]: [
            {
              startDate: { [Op.lte]: endDateObj },
              endDate: { [Op.gte]: startDateObj },
            },
            {
              startDate: { [Op.lte]: endDateObj },
              endDate: { [Op.gte]: startDateObj },
            },
          ],
          id: { [Op.not]: bookingId },
        },
      });

      // Check if either startDate or endDate is the same as an existing booking's start or end date
      if (existingBookings.some(existingBooking => {
        const existingStartDate = new Date(existingBooking.startDate);
        const existingEndDate = new Date(existingBooking.endDate);
        return startDateObj.getTime() === existingStartDate.getTime() || startDateObj.getTime() === existingEndDate.getTime() || endDateObj.getTime() === existingStartDate.getTime() || endDateObj.getTime() === existingEndDate.getTime();
      })) {
        return res.status(403).json({
          message: "Booking conflicts with an existing booking",
          errors: {
            "startDate": "Start date conflicts with an existing booking",
            "endDate": "End date conflicts with an existing booking",
          },
        });
      }

      // Check if the start and end dates surround an existing booking
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

      // Check if both the start and end dates are within an existing booking
      if (existingBookings.some(existingBooking => {
        const existingStartDate = new Date(existingBooking.startDate);
        const existingEndDate = new Date(existingBooking.endDate);
        return startDateObj >= existingStartDate && endDateObj <= existingEndDate;
      })) {
        return res.status(403).json({
          message: "Booking conflicts with an existing booking",
          errors: {
            "startDate": "Start date is within an existing booking",
            "endDate": "End date is within an existing booking",
          },
        });
      }

      // Update the booking
      await booking.update({
        startDate: startDateObj,
        endDate: endDateObj,
      });

      // Return the updated booking
      res.status(200).json({
        id: booking.id,
        spotId: booking.spotId,
        userId: booking.userId,
        startDate: startDateObj,
        endDate: endDateObj,
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
