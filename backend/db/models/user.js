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


//spots migration
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
//       createdAt: {
//         type: Sequelize.DATE,
//         allowNull: false
//       },
//       updatedAt: {
//         type: Sequelize.DATE,
//         allowNull: false
//       }
//     });
//     await queryInterface.addColumn('Spots', 'ownerId', {
//       type: Sequelize.INTEGER,
//         allowNull: false,
//         references: {
//           model: 'Users',
//           key: 'id',
//         },
//     });
//   },
//   async down(queryInterface, Sequelize) {
//     await queryInterface.dropTable('Spots');
//   }
// };

// //spots model
// 'use strict';
// const {
//   Model, Sequelize
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class Spot extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//       Booking.belongsTo(models.User, { // Reference 'User', not 'Users'
//         foreignKey: 'ownerId',
//         onDelete: 'CASCADE',
//       });
//     }
//   }
//   Spot.init(
//     {
//       id: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true,
//       },
//       address: {
//         type: DataTypes.STRING(100),
//         allowNull: false,
//       },
//       city: {
//         type: DataTypes.STRING(100),
//         allowNull: false,
//       },
//       state: {
//         type: DataTypes.STRING(100),
//         allowNull: false,
//       },
//       country: {
//         type: DataTypes.STRING(100),
//         allowNull: false,
//       },
//       lat: {
//         type: DataTypes.DECIMAL,
//         allowNull: false,
//       },
//       lng: {
//         type: DataTypes.DECIMAL,
//         allowNull: false,
//       },
//       name: {
//         type: DataTypes.STRING(100),
//         allowNull: false,
//       },
//       description: {
//         type: DataTypes.STRING(100),
//         allowNull: false,
//       },
//       price: {
//         type: DataTypes.DECIMAL,
//         allowNull: false,
//       },
//       ownerId: {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//         references: {
//           model: 'Users',
//           key: 'id',
//         },
//       },
//       createdAt: {
//         type: DataTypes.Date,
//         defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
//       },
//       updatedAt: {
//         type: DataTypes.Date,
//         defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
//       },
//     },
//     {
//       sequelize,
//       modelName: 'Spots',
//     }
//   );

//   return Spot;
// };
