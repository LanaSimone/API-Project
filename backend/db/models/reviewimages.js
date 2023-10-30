'use strict';
const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ReviewImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ReviewImage.belongsTo(models.Review, { // Reference 'User', not 'Users'
        foreignKey: 'reviewId',
        // onDelete: 'CASCADE',
      });
    }
  }
  ReviewImage.init({
    reviewId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Reviews',
        key: 'id'
      }
    },
    url: {
      type: DataTypes.STRING(500)
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
  }, {
    sequelize,
    modelName: 'ReviewImage',
  });
  return ReviewImage;
};
