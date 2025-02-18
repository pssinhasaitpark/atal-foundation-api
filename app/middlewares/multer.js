const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'user_photos',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
});



const upload = multer({ storage: storage });

module.exports = upload;
