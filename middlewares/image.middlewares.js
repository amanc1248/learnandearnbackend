const dotenv = require("dotenv");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
dotenv.config();

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  folder: "my_folder",
  allowedFormats: ["jpg", "jpeg", "png"],
});

const uploadImageMiddleware = async (req, res, next) => {
  try {
    const buffer = req.file.buffer;
    const base64 = buffer.toString('base64');
    cloudinary.uploader.upload(`data:image/png;base64,${base64}`, (error, result) => {
      if (error) {
        console.error(error);
        return res.status(500).send("There was an error uploading the image.");
      }
      console.log(result.url);
      req.uploadedImageUrl = result.url;
      next();
    });
  } catch (e) {
    console.log(e);
  }
};
module.exports = {
  uploadImageMiddleware,
};
