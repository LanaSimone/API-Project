'use strict';
const { Model, Validator } = require('sequelize');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Review.belongsTo(models.User, { // Reference 'User', not 'Users'
        foreignKey: 'userId',
        // onDelete: 'CASCADE',
      });

      Review.belongsTo(models.Spots, { // Reference 'Spot', not 'Spots'
        foreignKey: 'spotId',
        // onDelete: 'CASCADE',
      });
      Review.hasMany(models.ReviewImage, {
        foreignKey: 'reviewId', // The foreign key in the ReviewImages model
        // onDelete: 'CASCADE',
      });
    }
  }
  Review.init({
    spotId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Spots',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    review: {
      type: DataTypes.STRING(500)
    },
    stars: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    avgStarRating: {
      type: DataTypes.INTEGER,
      allowNull: true,
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
    modelName: 'Review',
  });
  return Review;
};
