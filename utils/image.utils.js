const dotenv = require('dotenv');
const fileUpload = require('express-fileupload');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
dotenv.config();

// Configuration 
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'my_folder',
  allowedFormats: ['jpg', 'jpeg', 'png'],
});


const uploadImageUtil = async ({imageFile}) => {
  try {
    const file = imageFile;
    cloudinary.uploader.upload(file, { folder: 'my_folder' }, (error, result) => {
      if (error) {
        console.error(error);
        return res.status(500).send('There was an error uploading the image.');
      }
      console.log(result);
      res.send(result);
    });
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

module.exports = {
  uploadImageUtil,
};
