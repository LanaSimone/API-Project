'use strict';

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
        preview: true,
      },
      // Add more data objects for SpotImages as needed
    ]

    try {
      await queryInterface.bulkInsert('SpotImages', spotImages, {});

      // Fetch SpotImages to set previewImage in Spots
         // Fetch SpotImages to set previewImage in Spots
      const spots = await queryInterface.sequelize.query('SELECT id FROM "Spots";', {
        type: queryInterface.sequelize.QueryTypes.SELECT,
      });

      for (const spot of spots) {
        const previewImage = await queryInterface.sequelize.query(
          'SELECT url FROM "SpotImages" WHERE spotId = :spotId AND preview = true LIMIT 1;',
          {
            replacements: { spotId: spot.id },
            type: queryInterface.sequelize.QueryTypes.SELECT,
          }
        );

        if (previewImage.length > 0) {
          await queryInterface.sequelize.query(
            'UPDATE "Spots" SET "previewImage" = :url WHERE id = :spotId;',
            {
              replacements: { spotId: spot.id, url: previewImage[0].url },
              type: queryInterface.sequelize.QueryTypes.UPDATE,
            }
          );
        }
      }
    } catch (error) {
      console.error('Error during SpotImages seeding:');
      console.error(error);
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Assuming you have already retrieved user IDs in this file
    const spotIds = [1, 2, 3]; // Use actual spot IDs

    try {
      await queryInterface.bulkDelete('SpotImages', { spotId: spotIds }, {});
    } catch (error) {
      console.error('Error during SpotImages deletion:');
      console.error(error);
    };
  }
};
