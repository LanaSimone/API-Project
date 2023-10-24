'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in the options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    // Assuming you have already retrieved user IDs in this file
    const spotId = await queryInterface.rawSelect('Spots', {
      where: {
        
      },
    }, ['id']);
    return Promise.all([
      queryInterface.bulkInsert('SpotImages', [
        {
          spotId: 1, // Replace with the appropriate spotId
        url: 'image_url_1',
        preview: true,
        },
        {
          spotId: 1, // Replace with the appropriate spotId
          url: 'image_url_2',
          preview: false,
        },
        {
          spotId: 2, // Replace with the appropriate spotId
          url: 'image_url_3',
          preview: true,
        },
        {
          spotId: 2, // Replace with the appropriate spotId
          url: 'image_url_4',
          preview: true,
        },
        {
          spotId: 3, // Replace with the appropriate spotId
          url: 'image_url_5',
          preview: true,
        },
        {
          spotId: 3, // Replace with the appropriate spotId
          url: 'image_url_6',
          preview: true,
        },
        // Add more data objects for Spots as needed
      ]),
    ]);
  },

  async down(queryInterface, Sequelize) {
    // Corrected this line
    options.tableName = 'SpotImages';

    return Promise.all([
      queryInterface.bulkDelete(options),
      // Any other table deletions if needed
    ]);
  }
};
