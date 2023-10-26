'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // Define your schema in the options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     */
    const bookings = [
      {
        spotId: 1,  // Replace with the actual spot ID
        userId: 1,   // Replace with the actual user ID
        startDate: new Date(),
        endDate: new Date(), // Replace with the start date
        // createdAt: new Date(),
        // updatedAt: new Date(),
      },
      {
        spotId: 2,  // Replace with the actual spot ID
        userId: 2,   // Replace with the actual user ID
        startDate: new Date(),
        endDate: new Date(), // Replace with the start date
        // createdAt: new Date(),
        // updatedAt: new Date(),
      },
      {
        spotId: 3,  // Replace with the actual spot ID
        userId: 3,   // Replace with the actual user ID
        startDate: new Date(),
        endDate: new Date(), // Replace with the start date
        // createdAt: new Date(),
        // updatedAt: new Date(),
      },
      // Add more Booking objects as needed
    ];

    console.log('Inserting Bookings:', bookings);

    try {
      await queryInterface.bulkInsert('Bookings', bookings, {});
      console.log('Seed data successfully inserted.');
    } catch (error) {
      console.error('Error inserting seed data:', error);
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     */
    console.log('Reverting seed data...');
    try {
      await queryInterface.bulkDelete('Bookings', null, {});
      console.log('Seed data successfully reverted.');
    } catch (error) {
      console.error('Error reverting seed data:', error);
    }
  }
};
