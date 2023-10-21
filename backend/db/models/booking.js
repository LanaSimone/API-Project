'use strict';
const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate(models) {
      Booking.belongsTo(models.User, { // Reference 'User', not 'Users'
        foreignKey: 'userId',
        onDelete: 'CASCADE',
      });

      Booking.belongsTo(models.Spot, { // Reference 'Spot', not 'Spots'
        foreignKey: 'spotId',
        onDelete: 'CASCADE',
      })
    }
  }

  Booking.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      spotId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Spots',
          key: 'id'
        }
       }, // foreign key for spot
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      startDate: {
          type: DataTypes.DATE,
          allowNull: false
     },
     endDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
     createdAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },

    },
    {
      sequelize,
      modelName: 'Booking',
    }
  );

  return Booking;
};
