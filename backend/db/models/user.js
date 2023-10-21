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
// const {
//   Model
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
//       Spot.belongsTo(models.User, {
//         foreignKey: 'ownerId',
//         onDelete: 'CASCADE',
//       });
//     }
//   }
//   Spot.init( {
//     id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     address: {
//       type: DataTypes.STRING(100),
//       allowNull: false,
//     },
//     city: {
//       type: DataTypes.STRING(100),
//       allowNull: false,
//     },
//     state: {
//       type: DataTypes.STRING(100),
//       allowNull: false,
//     },
//     country: {
//       type: DataTypes.STRING(100),
//       allowNull: false,
//     },
//     lat: {
//       type: DataTypes.DECIMAL,
//       allowNull: false,
//     },
//     lng: {
//       type: DataTypes.DECIMAL,
//       allowNull: false,
//     },
//     name: {
//       type: DataTypes.STRING(100),
//       allowNull: false,
//     },
//     description: {
//       type: DataTypes.STRING(100),
//       allowNull: false,
//     },
//     price: {
//       type: DataTypes.DECIMAL,
//       allowNull: false,
//     },
//     ownerId: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
//     createdAt: {
//       type: DataTypes.DATE,
//       defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
//     },
//     updatedAt: {
//       type: DataTypes.DATE,
//       defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
//     },
//   },
//   {
//     sequelize,
//     modelName: 'Spot',
//     }
//   );
//   return Spot;
// };
