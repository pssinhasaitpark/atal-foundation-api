
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadImageToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "atal-foundation", resource_type: "image" },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Image Upload Error:", error);
          reject(error);
        } else {
          // console.log("Image Uploaded:", result.secure_url);
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
