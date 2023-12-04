'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in the options object
}


module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Assuming you have already retrieved user IDs in this file
    const spotIds = [1, 2, 3]; // Use actual spot IDs


    const spotImages = [
      {
        spotId: spotIds[0], // Use the ID of the first user
        url: '../images/spot-1.jpg',
        preview: true,
      },
      {
        spotId: spotIds[1], // Use the ID of the second spot
        url: '../images/spot-2.jpg',
        preview: true,
      },
      {
        spotId: spotIds[2], // Use the ID of the third spot
        url: '../images/spot-3.jpg',
        preview: false,
      },
      // Add more data objects for Spots as needed
    ];



    try {
      await queryInterface.bulkInsert('SpotImages', spotImages, {});

    } catch (error) {
      console.error('Error during SpotImages seeding:');
      console.error(error);
    }
  },

  down: async (queryInterface, Sequelize) => {


    // Corrected this line
    options.tableName = 'SpotImages';

    try {
      await queryInterface.bulkDelete('SpotImages', null, {});

    } catch (error) {

    }
  }
};
