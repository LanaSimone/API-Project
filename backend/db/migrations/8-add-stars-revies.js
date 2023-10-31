'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('Reviews', 'stars', {
      type: Sequelize.INTEGER,

    });
    await queryInterface.addColumn('Reviews', 'avgStarRating', {
        type: Sequelize.INTEGER,
        allowNull: true

      });

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('Reviews', 'Stars');
    await queryInterface.removeColumn('Reviews', 'avgStarRating');

  },
};
