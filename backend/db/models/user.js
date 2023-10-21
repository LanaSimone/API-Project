'use strict';
const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
    }
  };

  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [4, 30],
          isNotEmail(value) {
            if (Validator.isEmail(value)) {
              throw new Error("Cannot be an email.");
            }
          }
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [3, 256],
          isEmail: true
        }
      },
      hashedPassword: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
        validate: {
          len: [60, 60]
        }
      }
    },
    {
      sequelize,
      modelName: "User",
      defaultScope: {
        attributes: {
          exclude: ["hashedPassword", "email", "createdAt", "updatedAt"]
        }
      }
    }
  )
  return User;
};




// 'use strict';

// let options = {}
// if (process.env.NODE_ENV === 'production') {
//   options.schema = process.env.SCHEMA;  // Define your schema in the options object
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
//     await queryInterface.addColumn('Users', 'firstName', {
//       type: Sequelize.STRING,
//       allowNull: true, // You can set this to false if first names are required.
//     })

//     await queryInterface.addColumn('Users', 'lastName', {
//       type: Sequelize.STRING,
//       allowNull: true, // You can set this to false if last names are required.
//     })
//   },

//   async down (queryInterface, Sequelize) {
//     /**
//      * Add reverting commands here.
//      *
//      * Example:
//      * await queryInterface.dropTable('users');
//      */

//     await queryInterface.removeColumn('Users', 'firstName');
//     await queryInterface.removeColumn('Users', 'lastName');
//   }
// };
