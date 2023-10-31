'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in the options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    // Assuming you have already retrieved user IDs in this file
    const userIds = [1, 2, 3]; // Use actual user IDs

    return Promise.all([
      queryInterface.bulkInsert('Spots', [
        {
          ownerId: userIds[0], // Use the ID of the first user
          address: '123 Main St',
          city: 'Vernon',
          state: 'Connecticut',
          country: 'United States',
          lat: 133.906,
          lng: 789.012,
          name: 'Spot 1',
          description: 'Spot 1 description',
          price: 20.0,
          createdAt: new Date(),
          updatedAt: new Date(),
          avgStarRating: 3,
          previewImage: "url-3"
        },
        {
          ownerId: userIds[1], // Use the ID of the second user
          address: '199 Center St',
          city: 'Manchester',
          state: 'Connecticut',
          country: 'United States',
          lat: 910.482,
          lng: 321.192,
          name: 'Spot 2',
          description: 'Spot 2 description',
          price: 80.0,
          createdAt: new Date(),
          updatedAt: new Date(),
          avgStarRating: 5,
          previewImage: "url-2"
        },
        {
          ownerId: userIds[2], // Use the ID of the third user
          address: '1363 Hill St',
          city: 'Manhattan',
          state: 'New York',
          country: 'United States',
          lat: 192.482,
          lng: 763.835,
          name: 'Spot 3',
          description: 'Spot 3 description',
          price: 192.2,
          createdAt: new Date(),
          updatedAt: new Date(),
          avgStarRating: 2,
          previewImage: "url-1"
        },
        // Add more data objects for Spots as needed
      ]),
    ]);
  },

  async down(queryInterface, Sequelize) {
    // Corrected this line
    options.tableName = 'Spots';

    return Promise.all([
      queryInterface.bulkDelete('Spots', null, {}),
      // Any other table deletions if needed
    ]);
  }
};