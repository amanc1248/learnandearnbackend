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

const upload = multer({ storage: storage });

module.exports = {
    upload,
};
