'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in the options object
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    const spotImages = [
      {
        spotId: 1, // Replace with an existing Spot ID from your database
        url: 'sample-image-url-1',
        preview: true,
      },
      {
        spotId: 1, // Replace with an existing Spot ID from your database
        url: 'sample-image-url-2',
        preview: false,
      },
      {
        spotId: 2, // Replace with an existing Spot ID from your database
        url: 'sample-image-url-3',
        preview: true,
      },
      {
        spotId: 2, // Replace with an existing Spot ID from your database
        url: 'sample-image-url-4',
        preview: false,
      },
      {
        spotId: 3, // Replace with an existing Spot ID from your database
        url: 'sample-image-url-5',
        preview: true,
      },
      {
        spotId: 3, // Replace with an existing Spot ID from your database
        url: 'sample-image-url-6',
        preview: false,
      },
      // Add more associations as needed
    ];

    return queryInterface.bulkInsert('SpotImages', spotImages, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('SpotImages', null, {});
  },
};
