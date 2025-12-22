// require("dotenv").config();
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// console.log("--- Cloudinary Config Check ---");
// console.log({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? 'CONNECTED' : 'MISSING',
//   api_key: process.env.CLOUDINARY_API_KEY ? 'CONNECTED' : 'MISSING',
//   api_secret: process.env.CLOUDINARY_API_SECRET ? 'CONNECTED' : 'MISSING',
// });
// console.log("-------------------------------");


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'listings',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ storage: storage });
module.exports = upload;