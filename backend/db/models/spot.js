'use strict';

const { Model } = require('sequelize');
// const SpotImage = require('./spotImage');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = (sequelize, DataTypes) => {
  class Spots extends Model {
    static associate(models) {
      Spots.belongsTo(models.User, {
        foreignKey: 'ownerId',
      });
      Spots.hasMany(models.SpotImage, {
        foreignKey: 'spotId',
        as: 'SpotImages',
      });
      Spots.hasMany(models.Bookings, {
        foreignKey: 'spotId',
      });
      Spots.hasMany(models.Review, {
        foreignKey: 'spotId',
      });
    }

    // Adding a hook to set previewImage before saving the Spot
    // static async beforeSave(spot, options) {
    //   console.log('!!!!!!!!!!!!!!Before save hook executed for Spot:', spot.id);

    //   // Use sequelize instance to access SpotImage model
    //   const SpotImage = sequelize.models.SpotImage;

    //   try {
    //     const spotImages = await SpotImage.findAll({
    //       where: {
    //         spotId: spot.id,
    //         preview: true, // Filter to get only preview images
    //       },
    //     });

    //     console.log('!!!!!!!!!Spot Images:', spotImages);

    //     if (spotImages.length > 0) {
    //       spot.previewImage = spotImages[0].url;
    //       console.log('PreviewImage URL:', spot.previewImage);
    //     } else {
    //       console.log('No preview images found for Spot:', spot.id);
    //     }
    //   } catch (error) {
    //     console.error('Error fetching spot images:', error);
    //   }
    // }
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
    // ... rest of your field definitions ...
    previewImage: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'Spots',
    tableName: 'Spots',
    hooks: {
      beforeSave: async (spot, options) => {
        await Spots.beforeSave(spot, options);
      },
    },
  });

  return Spots;
};
