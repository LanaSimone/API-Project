// 'use strict';
// let options = {};
// if (process.env.NODE_ENV === 'production') {
//   options.schema = process.env.SCHEMA;  // define your schema in options object
// }

// /** @type {import('sequelize-cli').Migration} */
// module.exports = {
//   async up (queryInterface, Sequelize) {
//     /**
//      * Add altering commands here.
//      *
//      * Example:
//      * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
//      */
//     await queryInterface.createTable('Bookings', {
//       id: {
//         allowNull: false,
//         autoIncrement: true,
//         primaryKey: true,
//         type: Sequelize.INTEGER,
//       },
//       spotId: {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//         references: {
//           model: 'Spots',
//           key: 'id'
//         }
//        }, // foreign key for spot
//       userId: {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//         references: {
//           model: 'Users',
//           key: 'id'
//         }
//       },
//       startDate: {
//         type: Sequelize.DATE,
//         allowNull: false
//       },
//       createdAt: {
//         type: Sequelize.DATE,

//       },
//       updatedAt: {
//         type: Sequelize.DATE,

//       },
//     }, options);
//   },

//   async down (queryInterface, Sequelize) {
//     /**
//      * Add reverting commands here.
//      *
//      * Example:
//      * await queryInterface.dropTable('users');
//      */
//     options.tableName = "Bookings"
//     return queryInterface.dropTable('Bookings');
//   }
// };
