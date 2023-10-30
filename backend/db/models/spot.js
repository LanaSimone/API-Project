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
      allowNull: false
    },
    city: {
      type: DataTypes.STRING(100)
    },
    state: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    lat: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    lng: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'), // Capital 'S' for Sequelize
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'), // Capital 'S' for Sequelize
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
