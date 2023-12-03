const { Spots, SpotImage } = require('../models'); // Adjust the import path based on your project structure

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // Define your schema in the options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      try {
        const userIds = [1, 2, 3]; // Use actual user IDs

        const spotData = [
          {
            ownerId: userIds[0], // Use the ID of the first user
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
            // previewImage: "../images/spot-1.jpg"
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
            description: 'The views from the park are to die for',
            price: 80.0,
            createdAt: new Date(),
            updatedAt: new Date(),
            avgStarRating: 5,
            // previewImage: "../images/spot-2.jpg"
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
            description: 'Get away in the city ',
            price: 192.2,
            createdAt: new Date(),
            updatedAt: new Date(),
            avgStarRating: 2,
            // previewImage: "../images/spot-3.jpg"
          },
          // Add more data objects for Spots as needed
        ];

      // Insert spots
        const spots = await Spots.bulkCreate(spotData);

        // Fetch SpotImages to set previewImage in Spots
        for (const spot of spots) {
          const previewImage = await SpotImage.findOne({
            where: { spotId: spot.id, preview: true },
          });

          if (previewImage) {
            // Update previewImage in Spots
            await spot.update({ previewImage: previewImage.url });
          }
        }
      } catch (error) {
        console.error('Error during SpotImages seeding:');
        console.error(error);
      }
    });
  },

  async down(queryInterface, Sequelize) {
    try {
      // Delete spots
      await queryInterface.bulkDelete('Spots', null);
    } catch (error) {
      console.error('Error during Spots seeding:');
      console.error(error);
    }
  },
};
