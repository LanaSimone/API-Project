'use strict';

const { Model, Validator } = require('sequelize');


module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Spot.belongsTo(models.User, {
        foreignKey: 'ownerId',
        onDelete: 'CASCADE',
      });
    }
  }
  Spot.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    ownerId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
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
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};
