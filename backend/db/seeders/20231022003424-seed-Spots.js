'use strict';
const path = require('path');
const axios = require('axios');


let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in the options object
}


module.exports = {
  async up(queryInterface, Sequelize) {
    const userIds = [1, 2, 3]; // Use actual user IDs

    try {


      // Return an array of promises to ensure all bulk inserts are completed
      return Promise.all([
        queryInterface.bulkInsert('Spots', [
          {
            ownerId: userIds[0],
            address: '123 Main St',
            city: 'Vernon',
            state: 'Connecticut',
            country: 'United States',
            lat: 133.906,
            lng: 789.012,
            name: 'Spot 1',
            description: 'A beautiful country-side estate',
            price: 20.0,
            createdAt: new Date(),
            updatedAt: new Date(),
            avgStarRating: 3,
            previewImage: 'https://s.hdnux.com/photos/01/26/10/64/22580499/6/1200x0.jpg'
          },
          {
            ownerId: userIds[1],
            address: '199 Center St',
            city: 'Manchester',
            state: 'Connecticut',
            country: 'United States',
            lat: 910.482,
            lng: 321.192,
            name: 'Spot 2',
            description: 'The views from the park are to die for',
            price: 80.0,
            createdAt: new Date(),
            updatedAt: new Date(),
            avgStarRating: 5,
            previewImage: 'https://images-listings.coldwellbanker.com/CT/17/05/75/55/4/_P/170575554_P00.jpg?width=1024'
          },
          {
            ownerId: userIds[2],
            address: '1363 Hill St',
            city: 'Manhattan',
            state: 'New York',
            country: 'United States',
            lat: 192.482,
            lng: 763.835,
            name: 'Spot 3',
            description: 'Get away in the city ',
            price: 192.2,
            createdAt: new Date(),
            updatedAt: new Date(),
            avgStarRating: 2,
            previewImage: 'https://wp-tid.zillowstatic.com/streeteasy/2/GettyImages-165493611-fbd491.jpg'
          },
          // Add more data objects for Spots as needed
        ]),
      ]);
    } catch (error) {
      console.error('Error during Spots seeding:');
      console.error(error);
    }
  },

  async down(queryInterface, Sequelize) {
    // Corrected this line
    options.tableName = 'Spots';

    try {
      await queryInterface.bulkDelete('Spots', null, {});
      // Any other table deletions if needed
    } catch (error) {
      console.error('Error during Spots deletion:');
      console.error(error);
    }
  }
}
