const express = require('express');
const router = express.Router();
const {  Bookings, Spots, User, SpotImage } = require('../../db/models');
const moment = require('moment');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { validationResult, body } = require('express-validator'); // Add this line
const requireSpotOwnership = require('../api/spots')


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


// const formatDate = (date) => {
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, '0');
//   const day = String(date.getDate()).padStart(2, '0');
//   return `${year}-${month}-${day}`;
// };

// const formatDateTime = (date) => {
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, '0');
//   const day = String(date.getDate()).padStart(2, '0');
//   const hours = String(date.getHours()).padStart(2, '0');
//   const minutes = String(date.getMinutes()).padStart(2, '0');
//   const seconds = String(date.getSeconds()).padStart(2, '0');
//   return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
// };

function formatDate(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDateTime(dateTime) {
  const date = formatDate(dateTime);
  const hours = dateTime.getHours().toString().padStart(2, '0');
  const minutes = dateTime.getMinutes().toString().padStart(2, '0');
  const seconds = dateTime.getSeconds().toString().padStart(2, '0');
  return `${date} ${hours}:${minutes}:${seconds}`;
}


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
      const previewImage = SpotImages[0] ? SpotImages[0].url : ''; // Assuming you want the first URL


      const formattedCreatedAt = new Date(createdAt).toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      const formattedUpdatedAt = new Date(updatedAt).toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

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
          lat: parseFloat(lat),
          lng: parseFloat(lng),
          name,
          price: parseFloat(price),
          previewImage,
        },
        userId,
        startDate: formatDate(startDate), // Format the startDate
        endDate: formatDate(endDate),
        createdAt: formattedCreatedAt, // Formatted createdAt
        updatedAt: formattedUpdatedAt,
      };
    });

    res.status(200).json({ Bookings: formattedBookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

const { Op } = require('sequelize')

  // PUT /api/bookings/:bookingId update bookings
  router.put('/:bookingId', requireAuth,  async (req, res) => {
    try {
      const { startDate, endDate } = req.body;
      const bookingId = req.params.bookingId;
      const userId = req.user.id;

      // Check if the booking exists
      const booking = await Bookings.findByPk(bookingId);

      if (!booking) {
        return res.status(404).json({ message: "Booking couldn't be found" });
      }

      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);

      // Check if the booking belongs to the current user
      if (booking.userId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const currentDate = new Date();
      if (endDateObj < currentDate) {
        return res.status(403).json({ message: "Past bookings can't be modified" });
      }

      // // Check if end date comes before start date
      if (startDateObj.getTime() === endDateObj.getTime()) {
        return res.status(400).json({
          message: "Bad Request",
          errors: {

            endDate: "endDate cannot come before startDate"
          },
        });
      }


      if (startDateObj >= endDateObj) {
        return res.status(400).json({
          message: "Bad Request",
          errors: {
            endDate: "endDate cannot come before startDate"
          },
        });
      }


      // Check for booking conflicts
      const existingBookings = await Bookings.findAll({
        where: {
          spotId: booking.spotId,
          [Op.or]: [
            {
              startDate: { [Op.lte]: endDateObj },
              endDate: { [Op.gte]: startDateObj },
            },
          ],
        },
      });

      // Filter out the current booking from existingBookings
      const otherBookings = existingBookings.filter(b => b.id !== booking.id);

      // Check if either startDate or endDate is during an existing booking
      if (otherBookings.some(existingBooking => {
        const existingStartDate = new Date(existingBooking.startDate);
        const existingEndDate = new Date(existingBooking.endDate);
        return (
          (startDateObj >= existingStartDate && startDateObj <= existingEndDate) ||
          (endDateObj >= existingStartDate && endDateObj <= existingEndDate)
        );
      })) {
        return res.status(403).json({
          message: "Sorry, this spot is already booked for the specified dates",
          errors: {
            "startDate": "Start date conflicts with an existing booking",
            "endDate": "End date conflicts with an existing booking"
          },
        });
      }

      // Check if start date and end date surround an existing booking
      if (otherBookings.some(existingBooking => {
        const existingStartDate = new Date(existingBooking.startDate);
        const existingEndDate = new Date(existingBooking.endDate);
        return startDateObj <= existingStartDate && endDateObj >= existingEndDate;
      })) {
        return res.status(403).json({
          message: "Sorry, this spot is already booked for the specified dates",
          errors: {
            "startDate": "Start date conflicts with an existing booking",
            "endDate": "End date conflicts with an existing booking"
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
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        createdAt: new Date(),
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
router.delete('/:bookingId', requireAuth,  async (req, res) => {
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
      return res.status(403).json({ message: "Forbidden" });
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
