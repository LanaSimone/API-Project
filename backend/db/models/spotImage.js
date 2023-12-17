'use strict';
const { Model, Sequelize} = require('sequelize');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}


module.exports = (sequelize, DataTypes) => {
  class SpotImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      SpotImage.belongsTo(models.Spots, { // Reference 'User', not 'Users'
        foreignKey: 'spotId',
        // onDelete: 'CASCADE',
      });
    }
  }
  SpotImage.init({
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Spots',
        key: 'id'
      },
    },
    url: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    preview: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },{
    sequelize,
    modelName: 'SpotImage',


  });
  return SpotImage;
};

//usermigration


// 'use strict';

// const { sequelize } = require('../models');

// let options = {};
// if (process.env.NODE_ENV === 'production') {
//   options.schema = process.env.SCHEMA;  // define your schema in options object
// }
// /** @type {import('sequelize-cli').Migration} */
// module.exports = {
//   async up(queryInterface, Sequelize) {
//     await queryInterface.createTable('Users', {
//       id: {
//         allowNull: false,
//         autoIncrement: true,
//         primaryKey: true,
//         type: Sequelize.INTEGER
//       },
//       username: {
//         type: Sequelize.STRING(100),
//         unique: true
//       },
//       email: {
//         type: Sequelize.STRING(100),
//         unique: true
//       },
//       // firstName: {
//       //   type: Sequelize.STRING(50),
//       //   allowNull: false, // Add the firstName field
//       // },
//       // lastName: {
//       //   type: Sequelize.STRING(50),
//       //   allowNull: false // Add the lastName field
//       // },
//       hashedPassword: {
//         type: Sequelize.STRING
//       },
//       createdAt: {
//         allowNull: false,
//         type: Sequelize.DATE
//       },
//       updatedAt: {
//         allowNull: false,
//         type: Sequelize.DATE
//       }
//     }, options);
//   },
//   async down(queryInterface, Sequelize) {
//     options.tableName = "Users";
//     return queryInterface.dropTable('Users');
//   }
// };


//users migration

// 'use strict';
// const { Model, Validator } = require('sequelize');

// let options = {};
// if (process.env.NODE_ENV === 'production') {
//   options.schema = process.env.SCHEMA;  // define your schema in options object
// }

// module.exports = (sequelize, DataTypes) => {
//   class User extends Model {
//     static associate(models) {
//       User.hasMany(models.Spots, {
//         foreignKey: 'ownerId',
//         // onDelete: 'CASCADE'


//       });
//     }
//   }

//   User.init(
//     {
//       username: {
//         type: DataTypes.STRING(100),
//         allowNull: false,
//         unique: true,
//         validate: {
//           len: [4, 30],
//           isNotEmail(value) {
//             if (Validator.isEmail(value)) {
//               throw new Error("Cannot be an email.");
//             }
//           }
//         }
//       },
//       email: {
//         type: DataTypes.STRING(100),
//         allowNull: false,
//         unique: true,
//         validate: {
//           len: [3, 256],
//           isEmail: true
//         }
//       },
//       firstName: {
//         type: DataTypes.STRING(50), // Add the firstName field
//         allowNull: false,
//       },
//       lastName: {
//         type: DataTypes.STRING(50), // Add the lastName field
//         allowNull: false
//       },

//       hashedPassword: {
//         type: DataTypes.STRING.BINARY,
//         allowNull: false,
//         validate: {
//           len: [60, 60]
//         }
//       },

//     },
//     {
//       sequelize,
//       modelName: "User",
//       defaultScope: {
//         attributes: {
//           exclude: ["hashedPassword", "email", "createdAt", "updatedAt"]
//         }
//       }
//     }
//   )
//   return User
// };
