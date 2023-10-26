'use strict';


let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in the options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Reviews', [
      {
        userId: 1, // Replace with the actual userId
        spotId: 1, // Replace with the actual spotId
        review: 'This is a sample review.',
        stars: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2, // Replace with the actual userId
        spotId: 2, // Replace with the actual spotId
        review: 'This is a sample review.',
        stars: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 3, // Replace with the actual userId
        spotId: 3, // Replace with the actual spotId
        review: 'This is a sample review.',
        stars: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Reviews', null, {});
  },
};
