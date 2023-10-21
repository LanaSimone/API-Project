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
  );
  return User;
};





// 'use strict';
// /** @type {import('sequelize-cli').Migration} */
// module.exports = {
//   async up(queryInterface, Sequelize) {
//     await queryInterface.createTable('Spots', {
//       id: {
//         allowNull: false,
//         autoIncrement: true,
//         primaryKey: true,
//         type: Sequelize.INTEGER
//       },
//       address: {
//         type: Sequelize.STRING(100),
//         allowNull: false
//       },
//       city: {
//         type: Sequelize.STRING(100),
//         allowNull: false
//       },
//       state: {
//         type: Sequelize.STRING(100),
//         allowNull: false
//       },
//       country: {
//         type: Sequelize.STRING(100),
//         allowNull: false
//       },
//       lat: {
//         type: Sequelize.DECIMAL,
//         allowNull: false
//       },
//       lng: {
//         type: Sequelize.DECIMAL,
//         allowNull: false
//       },
//       name: {
//         type: Sequelize.STRING(100),
//         allowNull: false
//       },
//       description: {
//         type: Sequelize.STRING(100),
//         allowNull: false
//       },
//       price: {
//         type: Sequelize.DECIMAL,
//         allowNull: false
//       },
//       ownerId: {
//         type: Sequelize.INTEGER,
//         references: {
//           model: 'Users',
//           key: 'id'
//         }
//       },
//       createdAt: {
//         type: Sequelize.DATE,
//         allowNull: false
//       },
//       updatedAt: {
//         type: Sequelize.DATE,
//         allowNull: false
//       }
//     });
//   },
//   async down(queryInterface, Sequelize) {
//     await queryInterface.dropTable('Spots');
//   }
// }
