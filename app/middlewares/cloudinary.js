// const cloudinary = require("cloudinary").v2;

// cloudinary.config({
//   cloud_name: `${process.env.CLOUDINARY_CLOUD_NAME}`,
//   api_key: `${process.env.CLOUDINARY_API_KEY}`,
//   api_secret: `${process.env.CLOUDINARY_API_SECRET}`, 
// });
// const uploadImageToCloudinary = async (fileBuffer) => {
//   return new Promise((resolve, reject) => {
//     const uploadStream = cloudinary.uploader.upload_stream(
//       { folder: "atal-foundation" },
//       (error, result) => {
//         if (error) {
//           reject(error);
//         } else {
//           resolve(result.secure_url);
//         }
//       }
//     );
//     uploadStream.end(fileBuffer);
//   });
// };

// module.exports = {cloudinary,uploadImageToCloudinary};

// const cloudinary = require("cloudinary").v2;
// const streamifier = require("streamifier");

// // Cloudinary Configuration
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// });

// // Function to upload images to Cloudinary
// const uploadImageToCloudinary = (fileBuffer) => {
//   return new Promise((resolve, reject) => {
//     const uploadStream = cloudinary.uploader.upload_stream(
//       { folder: "atal-foundation", resource_type: "image" }, // Ensure resource type is image
//       (error, result) => {
//         if (error) {
//           console.error("Cloudinary Image Upload Error:", error);
//           reject(error);
//         } else {
//           console.log("Image Uploaded Successfully:", result.secure_url);
//           resolve(result.secure_url);
//         }
//       }
//     );
//     streamifier.createReadStream(fileBuffer).pipe(uploadStream);
//   });
// };

// // Function to upload videos to Cloudinary
// const uploadVideoToCloudinary = (fileBuffer) => {
//   return new Promise((resolve, reject) => {
//     const uploadStream = cloudinary.uploader.upload_stream(
//       { folder: "atal-foundation/videos", resource_type: "video" }, // Ensure resource type is video
//       (error, result) => {
//         if (error) {
//           console.error("Cloudinary Video Upload Error:", error);
//           reject(error);
//         } else {
//           console.log("Video Uploaded Successfully:", result.secure_url);
//           resolve(result.secure_url);
//         }
//       }
//     );
//     streamifier.createReadStream(fileBuffer).pipe(uploadStream);
//   });
// };

// module.exports = { cloudinary, uploadImageToCloudinary, uploadVideoToCloudinary };





const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Function to upload images
const uploadImageToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "atal-foundation", resource_type: "image" },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Image Upload Error:", error);
          reject(error);
        } else {
          console.log("Image Uploaded:", result.secure_url);
          resolve(result.secure_url);
        }
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

// Function to upload videos
const uploadVideoToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "atal-foundation/videos", resource_type: "video" },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Video Upload Error:", error);
          reject(error);
        } else {
          console.log("Video Uploaded:", result.secure_url);
          resolve(result.secure_url);
        }
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

module.exports = { cloudinary, uploadImageToCloudinary, uploadVideoToCloudinary };
