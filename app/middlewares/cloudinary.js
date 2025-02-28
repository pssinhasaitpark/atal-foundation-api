
// const cloudinary = require("cloudinary").v2;
// const streamifier = require("streamifier");

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// });

// const uploadImageToCloudinary = (fileBuffer) => {
//   return new Promise((resolve, reject) => {
//     const uploadStream = cloudinary.uploader.upload_stream(
//       { folder: "atal-foundation", resource_type: "image" },
//       (error, result) => {
//         if (error) {
//           console.error("Cloudinary Image Upload Error:", error);
//           reject(error);
//         } else {
//           // console.log("Image Uploaded:", result.secure_url);
//           resolve(result.secure_url);
//         }
//       }
//     );
//     streamifier.createReadStream(fileBuffer).pipe(uploadStream);
//   });
// };

// // Function to upload videos
// const uploadVideoToCloudinary = (fileBuffer) => {
//   return new Promise((resolve, reject) => {
//     const uploadStream = cloudinary.uploader.upload_stream(
//       { folder: "atal-foundation/videos", resource_type: "video" },
//       (error, result) => {
//         if (error) {
//           console.error("Cloudinary Video Upload Error:", error);
//           reject(error);
//         } else {
//           console.log("Video Uploaded:", result.secure_url);
//           resolve(result.secure_url);
//         }
//       }
//     );
//     streamifier.createReadStream(fileBuffer).pipe(uploadStream);
//   });
// };

// module.exports = { cloudinary, uploadImageToCloudinary, uploadVideoToCloudinary };


const express = require("express");
const multer = require("multer");
const path = require("path");
const sharp = require("sharp");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🔹 Multer Storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
}).fields([
  { name: "images", maxCount: 10 },
  { name: "videos", maxCount: 5 },
  { name: "banner", maxCount: 1 },
  { name: "detailImages", maxCount: 10 },
]);

// 🔹 Convert Images to WebP
const convertImagesToWebP = async (req, res, next) => {
  try {
    if (!req.files) {
      return next();
    }

    const processFile = async (file) => {
      file.buffer = await sharp(file.buffer).webp().toBuffer();
      file.mimetype = "image/webp";
      file.originalname = path.parse(file.originalname).name + ".webp";
    };

    // Process all uploaded files
    for (const key of Object.keys(req.files)) {
      await Promise.all(req.files[key].map(processFile));
    }

    next();
  } catch (err) {
    next(err);
  }
};

// 🔹 Cloudinary Image Upload
const uploadImageToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "atal-foundation", resource_type: "image" },
      (error, result) => {
        if (error) {
          console.error("❌ Cloudinary Image Upload Error:", error);
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

// 🔹 Cloudinary Video Upload
const uploadVideoToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "atal-foundation/videos", resource_type: "video" },
      (error, result) => {
        if (error) {
          console.error("❌ Cloudinary Video Upload Error:", error);
          reject(error);
        } else {
          console.log("✅ Video Uploaded:", result.secure_url);
          resolve(result.secure_url);
        }
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

module.exports = { cloudinary, uploadImageToCloudinary, uploadVideoToCloudinary,convertImagesToWebP ,upload};