'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Seed data for Spots
    const spotData = [
      {
        ownerId: 1, // Replace with the actual owner's ID from the Users table
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
      },
      {
        ownerId: 2, // Replace with the actual owner's ID from the Users table
        address: '199 Center St',
        city: 'Manchester',
        state: 'Connecticut',
        country: 'United States',
        lat: 910.482,
        lng: 321.192,
        name: 'Spot 2',
        description: 'Spot 2 descripton',
        price: 80.0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        ownerId: 3, // Replace with the actual owner's ID from the Users table
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
      },
      // Add more data objects for Spots as needed
    ];

    await queryInterface.bulkInsert('Spots', spotData);

    // Define ownerId as a foreign key
    await queryInterface.addConstraint('Spots', {
      type: 'foreign key',
      fields: ['ownerId'],
      name: 'custom_fkey_ownerId',
      references: {
        table: 'Users', // The table you're referencing
        field: 'id', // The field in the referenced table
      },
      onDelete: 'CASCADE', // Define the behavior on delete if needed
      onUpdate: 'CASCADE', // Define the behavior on update if needed
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove the constraint and delete data
    await queryInterface.removeConstraint('Spots', 'custom_fkey_ownerId');
    await queryInterface.bulkDelete('Spots', null, {});
  },
};
