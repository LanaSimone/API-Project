'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in the options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     */
    const reviewImages = [
      {
        reviewId: 1,
        url: 'example-url-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        reviewId: 2,
        url: 'example-url-2',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        reviewId: 3,
        url: 'example-url-3',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Add more ReviewImage objects as needed
    ];

    console.log('Inserting reviewImages:', reviewImages);

    try {
      await queryInterface.bulkInsert('ReviewImages', reviewImages, {});
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
      await queryInterface.bulkDelete('ReviewImages', null, {});
      console.log('Seed data successfully reverted.');
    } catch (error) {
      console.error('Error reverting seed data:', error);
    }
  }
};
