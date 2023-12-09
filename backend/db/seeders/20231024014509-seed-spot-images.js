'use strict';
const path = require('path');
const axios = require('axios');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in the options object
}
async function downloadImage(imageUrl) {
  const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
  return Buffer.from(response.data).toString('base64');
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Assuming you have already retrieved user IDs in this file
    const spotIds = [1, 2, 3]; // Use actual spot IDs

    // const imageUrl1 = 'https://media.architecturaldigest.com/photos/55f9e0394254f7de3455d6f9/master/w_1600%2Cc_limit/dam-images-daily-2015-05-ct-estate-greenwich-connecticut-english-style-estate-for-sale-02.jpg';
    // const previewImageBase641 = await downloadImageToBase64(imageUrl1);

    // const imageUrl2 = 'https://media.architecturaldigest.com/photos/627155f88860a6509c871129/16:9/w_320%2Cc_limit/Chauncey%2520Boothby%25204-%2520Read%2520McKendree.jpg';
    // const previewImageBase642 = await downloadImageToBase64(imageUrl2);

    // const imageUrl3 = 'https://images.mansionglobal.com/im-263914/?size=0&width=1280';
    // const previewImageBase643 = await downloadImageToBase64(imageUrl3);

    // const imageUrl4 = 'https://townsquare.media/site/677/files/2022/03/attachment-14-15.jpg?w=980&q=75';
    // const previewImageBase644 = await downloadImageToBase64(imageUrl4);

    // const imageUrl5 = 'https://townsquare.media/site/677/files/2022/06/attachment-10-35.jpg?w=980&q=75';
    // const previewImageBase645 = await downloadImageToBase64(imageUrl5);



    // const imageUrl6 = 'https://hgtvhome.sndimg.com/content/dam/images/hgtv/fullset/2021/1/25/0/CI_Evan-Joseph-Images_Central-Park-West-living-room-wide.jpg.rend.hgtvcom.616.411.suffix/1611578666239.jpeg';
    // const previewImageBase646 = await downloadImageToBase64(imageUrl6);

    // const imageUrl7 = 'https://i.redd.it/4qmetzsdehz71.jpg';
    // const previewImageBase647 = await downloadImageToBase64(imageUrl7);

    // const imageUrl8 = 'https://www.compass.com/m/0/4bee6e21-bb08-45b9-a32c-37b58545180f/origin.jpg';
    // const previewImageBase648 = await downloadImageToBase64(imageUrl8);

    // const imageUrl9 = 'https://cdn.vox-cdn.com/thumbor/5ePmcBTkKU0yrSJi3yMwHxAqNIE=/0x0:1200x800/1200x800/filters:focal(504x304:696x496)/cdn.vox-cdn.com/uploads/chorus_image/image/54913735/15_CPW.0.jpg';
    // const previewImageBase649 = await downloadImageToBase64(imageUrl9);

    // const imageUrl10 = 'https://robbreport.com/wp-content/uploads/2022/11/15_Central_Park_West_14.jpg?w=1000';
    // const previewImageBase6410 = await downloadImageToBase64(imageUrl10);



    // const imageUrl11 = 'https://www.tollbrothers.com/blog/wp-content/uploads/2019/03/160105_EJ_1110_park_0111-Edit.jpg';
    // const previewImageBase6411 = await downloadImageToBase64(imageUrl11);

    // const imageUrl12 = 'https://www.tollbrothers.com/blog/wp-content/uploads/2019/03/edited2179.jpg';
    // const previewImageBase6412 = await downloadImageToBase64(imageUrl12);

    // const imageUrl13 = 'https://nypost.com/wp-content/uploads/sites/2/2017/10/05641fifthavenueph452005hires1.jpg?quality=75&strip=all&w=744';
    // const previewImageBase6413 = await downloadImageToBase64(imageUrl13);

    // const imageUrl14 = 'https://media.architecturaldigest.com/photos/619598440478fa4720349ce4/16:9/w_2560%2Cc_limit/_Workstead_JSF_138.jpeg'
    // const previewImageBase6414 = await downloadImageToBase64(imageUrl14);

    // const imageUrl15 = 'https://media.architecturaldigest.com/photos/607f04c3c89710bb2f922c21/master/w_1600%2Cc_limit/*Workstead_JSF_237.jpg';
    // const previewImageBase6415 = await downloadImageToBase64(imageUrl15);

    // const spotImages = [
    //   {
    //     spotId: spotIds[0], // Use the ID of the first user
    //     url: previewImageBase641,
    //     preview: true,
    //   },
    //   {
    //     spotId: spotIds[0], // Use the ID of the first user
    //     url: previewImageBase642,
    //     preview: true,
    //   },
    //   {
    //     spotId: spotIds[0], // Use the ID of the first user
    //     url: previewImageBase643,
    //     preview: true,
    //   },
    //   {
    //     spotId: spotIds[0], // Use the ID of the first user
    //     url: previewImageBase644,
    //     preview: true,
    //   },
    //   {
    //     spotId: spotIds[0], // Use the ID of the first user
    //     url: previewImageBase645,
    //     preview: true,
    //   },

    //   {
    //     spotId: spotIds[1], // Use the ID of the second spot
    //     url:  previewImageBase646,
    //     preview: true,
    //   },
    //   {
    //     spotId: spotIds[1], // Use the ID of the second spot
    //     url: previewImageBase647,
    //     preview: true,
    //   },
    //   {
    //     spotId: spotIds[1], // Use the ID of the second spot
    //     url: previewImageBase648,
    //     preview: true,
    //   },
    //   {
    //     spotId: spotIds[1], // Use the ID of the second spot
    //     url: previewImageBase649,
    //     preview: true,
    //   },
    //   {
    //     spotId: spotIds[1], // Use the ID of the second spot
    //     url: previewImageBase6410,
    //     preview: true,
    //   },
    //   {
    //     spotId: spotIds[2], // Use the ID of the third spot
    //     url: previewImageBase6411,
    //     preview: false,
    //   },
    //   {
    //     spotId: spotIds[2], // Use the ID of the third spot
    //     url: previewImageBase6412,
    //     preview: false,
    //   },
    //   {
    //     spotId: spotIds[2], // Use the ID of the third spot
    //     url: previewImageBase6413,
    //     preview: false,
    //   },
    //   {
    //     spotId: spotIds[2], // Use the ID of the third spot
    //     url: previewImageBase6414,
    //     preview: false,
    //   },
    //   {
    //     spotId: spotIds[2], // Use the ID of the third spot
    //     url: previewImageBase6415,
    //     preview: false,
    //   },
    //   // Add more data objects for Spots as needed
    // ];



    // try {

   try {
      // Fetch and store each image sequentially
      const imageUrl1 = 'https://media.architecturaldigest.com/photos/55f9e0394254f7de3455d6f9/master/w_1600%2Cc_limit/dam-images-daily-2015-05-ct-estate-greenwich-connecticut-english-style-estate-for-sale-02.jpg';
      const imageUrl2 = 'https://media.architecturaldigest.com/photos/627155f88860a6509c871129/16:9/w_320%2Cc_limit/Chauncey%2520Boothby%25204-%2520Read%2520McKendree.jpg';
      const imageUrl3 = 'https://images.mansionglobal.com/im-263914/?size=0&width=1280';
      const imageUrl4 = 'https://townsquare.media/site/677/files/2022/03/attachment-14-15.jpg?w=980&q=75';
      const imageUrl5 = 'https://townsquare.media/site/677/files/2022/06/attachment-10-35.jpg?w=980&q=75';
      const imageUrl6 = 'https://hgtvhome.sndimg.com/content/dam/images/hgtv/fullset/2021/1/25/0/CI_Evan-Joseph-Images_Central-Park-West-living-room-wide.jpg.rend.hgtvcom.616.411.suffix/1611578666239.jpeg';
      const imageUrl7 = 'https://i.redd.it/4qmetzsdehz71.jpg';
      const imageUrl8 = 'https://www.compass.com/m/0/4bee6e21-bb08-45b9-a32c-37b58545180f/origin.jpg';
      const imageUrl9 = 'https://cdn.vox-cdn.com/thumbor/5ePmcBTkKU0yrSJi3yMwHxAqNIE=/0x0:1200x800/1200x800/filters:focal(504x304:696x496)/cdn.vox-cdn.com/uploads/chorus_image/image/54913735/15_CPW.0.jpg';
      const imageUrl10 = 'https://robbreport.com/wp-content/uploads/2022/11/15_Central_Park_West_14.jpg?w=1000';
      const imageUrl11 = 'https://www.tollbrothers.com/blog/wp-content/uploads/2019/03/160105_EJ_1110_park_0111-Edit.jpg';
      const imageUrl12 = 'https://www.tollbrothers.com/blog/wp-content/uploads/2019/03/edited2179.jpg';
      const imageUrl13 = 'https://nypost.com/wp-content/uploads/sites/2/2017/10/05641fifthavenueph452005hires1.jpg?quality=75&strip=all&w=744';
      const imageUrl14 = 'https://media.architecturaldigest.com/photos/619598440478fa4720349ce4/16:9/w_2560%2Cc_limit/_Workstead_JSF_138.jpeg';
      const imageUrl15 = 'https://media.architecturaldigest.com/photos/607f04c3c89710bb2f922c21/master/w_1600%2Cc_limit/*Workstead_JSF_237.jpg';

      // Fetch and insert each image into the database
      const previewImageBase641 = await downloadImage(imageUrl1);
      const previewImageBase642 = await downloadImage(imageUrl2);
      const previewImageBase643 = await downloadImage(imageUrl3);
      const previewImageBase644 = await downloadImage(imageUrl4);
      const previewImageBase645 = await downloadImage(imageUrl5);
      const previewImageBase646 = await downloadImage(imageUrl6);
      const previewImageBase647 = await downloadImage(imageUrl7);
      const previewImageBase648 = await downloadImage(imageUrl8);
      const previewImageBase649 = await downloadImage(imageUrl9);
      const previewImageBase6410 = await downloadImage(imageUrl10);
      const previewImageBase6411 = await downloadImage(imageUrl11);
      const previewImageBase6412 = await downloadImage(imageUrl12);
      const previewImageBase6413 = await downloadImage(imageUrl13);
      const previewImageBase6414 = await downloadImage(imageUrl14);
      const previewImageBase6415 = await downloadImage(imageUrl15);

      // Insert spot images into the database
      await queryInterface.bulkInsert('SpotImages', [
        { spotId: spotIds[0], url: previewImageBase641, preview: true },
        { spotId: spotIds[0], url: previewImageBase642, preview: true },
        { spotId: spotIds[0], url: previewImageBase643, preview: true },
        { spotId: spotIds[0], url: previewImageBase644, preview: true },
        { spotId: spotIds[0], url: previewImageBase645, preview: true },
        { spotId: spotIds[1], url: previewImageBase646, preview: true },
        { spotId: spotIds[1], url: previewImageBase647, preview: true },
        { spotId: spotIds[1], url: previewImageBase648, preview: true },
        { spotId: spotIds[1], url: previewImageBase649, preview: true },
        { spotId: spotIds[1], url: previewImageBase6410, preview: true },
        { spotId: spotIds[2], url: previewImageBase6411, preview: false },
        { spotId: spotIds[2], url: previewImageBase6412, preview: false },
        { spotId: spotIds[2], url: previewImageBase6413, preview: false },
        { spotId: spotIds[2], url: previewImageBase6414, preview: false },
        { spotId: spotIds[2], url: previewImageBase6415, preview: false },
      ], {});

    } catch (error) {
      console.error('Error during SpotImages seeding:');
      console.error(error);
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Corrected this line
    options.tableName = 'SpotImages';

    try {
      await queryInterface.bulkDelete('SpotImages', null, {});
    } catch (error) {
      console.error('Error during SpotImages deletion:');
      console.error(error);
    }
  }
};
