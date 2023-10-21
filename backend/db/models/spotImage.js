'use strict';
const { Model, Validator, Sequelize } = require('sequelize');


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
        onDelete: 'CASCADE',
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
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), // Capital 'S' for Sequelize
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), // Capital 'S' for Sequelize
    },

  },{
    sequelize,
    modelName: 'SpotImage',
  });
  return SpotImage;
};
