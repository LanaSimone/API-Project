'use strict';

const { Model, Validator } = require('sequelize');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}


module.exports = (sequelize, DataTypes) => {
  class Spots extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Spots.belongsTo(models.User, {
        foreignKey: 'ownerId',

        // onDelete: 'CASCADE',

      });
      Spots.hasMany(models.SpotImage, {
        foreignKey: 'spotId',
        as: 'SpotImages',
        // onDelete: 'CASCADE'
      });
      Spots.hasMany(models.Bookings, {
        foreignKey: 'spotId',
        // onDelete: 'CASCADE',
      });
      Spots.hasMany(models.Review, {
        foreignKey: 'spotId',
        // onDelete: 'CASCADE',
      })

    }



  }
  Spots.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    ownerId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    address: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Street address is required',
        },
      },
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'City is required',
        },
      },
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'State is required',
        },
      },
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Country is required',
        },
      },
    },
    lat: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Latitude is not valid',
        },
        isFloat: {
          msg: 'Latitude must be a valid number',
        },
      },
    },
    lng: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Longitude is not valid',
        },
        isFloat: {
          msg: 'Longitude must be a valid number',
        },
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Name is required',
        },
        len: {
          args: [1, 50],
          msg: 'Name must be less than 50 characters',
        },
      },
    },
    description: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Description is required',
        },
      },
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Price per day is required',
        },
        isFloat: {
          msg: 'Price must be a valid number',
        },
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    avgStarRating: {
      type: DataTypes.FLOAT, // or another appropriate data type
      allowNull: true, // or false, depending on your requirements
    },
  }, {
    sequelize,
    modelName: 'Spots',
    tableName: 'Spots'
  });
  return Spots;
};
