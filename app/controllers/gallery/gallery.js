const mongoose = require("mongoose");
const Gallery = require("../../models/gallery");
const cloudinary = require("../../middlewares/cloudinary");
const { galleryValidation } = require("../../validators/gallery");
const { handleResponse } = require("../../utils/helper");

// const createOrUpdateGallery = async (req, res) => {
//   try {
//     const { error } = galleryValidation.validate(req.body);
//     if (error) {
//       return handleResponse(res, 400, "Validation error", { errors: error.details });
//     }

//     const { gallery_image_title, gallery_image_description, gallery_video_title, gallery_video_description } = req.body;
//     const { id } = req.query;

//     let existingGallery = null;
//     if (id) {
//       existingGallery = await Gallery.findById(id);
//     }

//     let imageUrls = existingGallery ? existingGallery.gallery_image.images : [];
//     let videoUrls = existingGallery ? existingGallery.gallery_video.videos : [];

//     if (req.files) {
//       const imageFiles = req.files.images || [];
//       const videoFiles = req.files.videos || [];

//       if (imageFiles.length > 0) {
//         const uploadImagePromises = imageFiles.map(async (file) => cloudinary.uploadImageToCloudinary(file.buffer));
//         const uploadedImages = await Promise.all(uploadImagePromises);
//         imageUrls = [...imageUrls, ...uploadedImages];
//       }

//       if (videoFiles.length > 0) {
//         const uploadVideoPromises = videoFiles.map(async (file) => cloudinary.uploadVideoToCloudinary(file.buffer));
//         const uploadedVideos = await Promise.all(uploadVideoPromises);
//         videoUrls = [...videoUrls, ...uploadedVideos];
//       }
//     }

//     if (existingGallery) {
//       existingGallery.set({
//         gallery_image: {
//           _id: existingGallery.gallery_image._id || new mongoose.Types.ObjectId(),
//           title: gallery_image_title || existingGallery.gallery_image.title,
//           description: gallery_image_description || existingGallery.gallery_image.description,
//           images: imageUrls,
//         },
//         gallery_video: {
//           _id: existingGallery.gallery_video._id || new mongoose.Types.ObjectId(),
//           title: gallery_video_title || existingGallery.gallery_video.title,
//           description: gallery_video_description || existingGallery.gallery_video.description,
//           videos: videoUrls,
//         },
//       });

//       await existingGallery.save();
//       return handleResponse(res, 200, "Gallery Updated Successfully!", { gallery: existingGallery.toObject() });
//     } else {
//       const newGallery = new Gallery({
//         gallery_image: {
//           _id: new mongoose.Types.ObjectId(),
//           title: gallery_image_title,
//           description: gallery_image_description,
//           images: imageUrls,
//         },
//         gallery_video: {
//           _id: new mongoose.Types.ObjectId(),
//           title: gallery_video_title,
//           description: gallery_video_description,
//           videos: videoUrls,
//         },
//       });

//       await newGallery.save();
//       return handleResponse(res, 201, "Gallery Created Successfully!", { gallery: newGallery.toObject() });
//     }
//   } catch (error) {
//     return handleResponse(res, 500, "Error Creating or Updating Gallery", { error: error.message });
//   }
// };


const createOrUpdateGallery = async (req, res, next) => {
  try {
    const { error } = galleryValidation.validate(req.body);
    if (error) {
      return handleResponse(res, 400, "Validation error", { errors: error.details });
    }

    const {
      gallery_image_title,
      gallery_image_description,
      gallery_video_title,
      gallery_video_description,
    } = req.body;
    const { id } = req.query;

    let existingGallery = null;
    if (id) {
      existingGallery = await Gallery.findById(id);
    }

    let imageUrls = existingGallery ? existingGallery.gallery_image.images : [];
    let videoUrls = existingGallery ? existingGallery.gallery_video.videos : [];

    if (req.convertedFiles) {
      if (req.convertedFiles.images) {
        imageUrls = [...imageUrls, ...req.convertedFiles.images];
      }
      if (req.convertedFiles.videos) {
        videoUrls = [...videoUrls, ...req.convertedFiles.videos];
      }
    }

    if (existingGallery) {
      existingGallery.set({
        gallery_image: {
          _id: existingGallery.gallery_image._id || new mongoose.Types.ObjectId(),
          title: gallery_image_title || existingGallery.gallery_image.title,
          description: gallery_image_description || existingGallery.gallery_image.description,
          images: imageUrls,
        },
        gallery_video: {
          _id: existingGallery.gallery_video._id || new mongoose.Types.ObjectId(),
          title: gallery_video_title || existingGallery.gallery_video.title,
          description: gallery_video_description || existingGallery.gallery_video.description,
          videos: videoUrls,
        },
      });

      await existingGallery.save();

      req.contentCreated = true;
      req.contentTitle = gallery_image_title || "Gallery Updated";
      req.contentType = "gallery";

      handleResponse(res, 200, "Gallery Updated Successfully!", {
        gallery: existingGallery.toObject(),
      });

      next(); 
    } else {
      const newGallery = new Gallery({
        gallery_image: {
          _id: new mongoose.Types.ObjectId(),
          title: gallery_image_title,
          description: gallery_image_description,
          images: imageUrls,
        },
        gallery_video: {
          _id: new mongoose.Types.ObjectId(),
          title: gallery_video_title,
          description: gallery_video_description,
          videos: videoUrls,
        },
      });

      await newGallery.save();

      req.contentCreated = true;
      req.contentTitle = gallery_image_title || "New Gallery Created";
      req.contentType = "gallery";

      handleResponse(res, 201, "Gallery Created Successfully!", {
        gallery: newGallery.toObject(),
      });

      next(); 
    }
  } catch (error) {
    console.error("Error Creating or Updating Gallery:", error);
    return handleResponse(res, 500, "Error Creating or Updating Gallery", {
      error: error.message,
    });
  }
};

const getAllGallery = async (req, res) => {
  try {
    const galleries = await Gallery.find().sort({ createdAt: -1 });
    return handleResponse(res, 200, "Galleries fetched successfully", { galleries });
  } catch (error) {
    return handleResponse(res, 500, "Error fetching galleries", { error: error.message });
  }
};

const getGalleryById = async (req, res) => {
  try {
    const { id } = req.params;
    const gallery = await Gallery.findById(id);
    if (!gallery) {
      return handleResponse(res, 404, "Gallery not found");
    }
    return handleResponse(res, 200, "Gallery fetched successfully", { gallery });
  } catch (error) {
    return handleResponse(res, 500, "Error fetching gallery", { error: error.message });
  }
};

const updateGalleryById = async (req, res) => {
  try {
    const { id } = req.params;
    const { gallery_image_title, gallery_image_description, gallery_video_title, gallery_video_description } = req.body;

    // 🔥 Check if gallery exists
    const gallery = await Gallery.findById(id);
    if (!gallery) {
      return handleResponse(res, 404, "Gallery not found");
    }

    // ✅ Use files uploaded and processed by middleware
    let imageUrls = gallery.images || [];
    let videoUrls = gallery.videos || [];

    if (req.convertedFiles) {
      if (req.convertedFiles.images) {
        imageUrls = [...imageUrls, ...req.convertedFiles.images]; // Append new images
      }
      if (req.convertedFiles.videos) {
        videoUrls = [...videoUrls, ...req.convertedFiles.videos]; // Append new videos
      }
    }

    // 🎯 Prepare updated data
    const updatedData = {
      gallery_image_title: gallery_image_title || gallery.gallery_image_title,
      gallery_image_description: gallery_image_description || gallery.gallery_image_description,
      images: imageUrls,
      gallery_video_title: gallery_video_title || gallery.gallery_video_title,
      gallery_video_description: gallery_video_description || gallery.gallery_video_description,
      videos: videoUrls,
    };

    // 🚀 Update with findByIdAndUpdate
    const updatedGallery = await Gallery.findByIdAndUpdate(id, updatedData, {
      new: true, // Return updated document
      runValidators: true, // Validate data before updating
    });

    return handleResponse(res, 200, "Gallery updated successfully", { gallery: updatedGallery });
  } catch (error) {
    console.error("Error updating gallery:", error);
    return handleResponse(res, 500, "Error updating gallery", { error: error.message });
  }
};

// const updateGalleryById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { gallery_image_title, gallery_image_description, gallery_video_title, gallery_video_description } = req.body;

//     let gallery = await Gallery.findById(id);
//     if (!gallery) {
//       return handleResponse(res, 404, "Gallery not found");
//     }

//     let imageUrls = gallery.images;
//     let videoUrls = gallery.videos;

//     if (req.files && req.files.length > 0) {
//       const imageFiles = req.files.filter((file) => file.mimetype.startsWith("image"));
//       const videoFiles = req.files.filter((file) => file.mimetype.startsWith("video"));

//       if (imageFiles.length > 0) {
//         const uploadImagePromises = imageFiles.map((file) =>
//           cloudinary.uploadImageToCloudinary(file.buffer)
//         );
//         imageUrls = await Promise.all(uploadImagePromises);
//       }

//       if (videoFiles.length > 0) {
//         const uploadVideoPromises = videoFiles.map((file) =>
//           cloudinary.uploadVideoToCloudinary(file.buffer)
//         );
//         videoUrls = await Promise.all(uploadVideoPromises);
//       }
//     }

//     gallery.gallery_image_title = gallery_image_title || gallery.gallery_image_title;
//     gallery.gallery_image_description = gallery_image_description || gallery.gallery_image_description;
//     gallery.images = imageUrls;
//     gallery.gallery_video_title = gallery_video_title || gallery.gallery_video_title;
//     gallery.gallery_video_description = gallery_video_description || gallery.gallery_video_description;
//     gallery.videos = videoUrls;

//     await gallery.save();

//     return handleResponse(res, 200, "Gallery updated successfully", { gallery });
//   } catch (error) {
//     return handleResponse(res, 500, "Error updating gallery", { error: error.message });
//   }
// };

const deleteGalleryById = async (req, res) => {
  try {
    const { id } = req.params;
    const gallery = await Gallery.findByIdAndDelete(id);
    if (!gallery) {
      return handleResponse(res, 404, "Gallery not found");
    }
    return handleResponse(res, 200, "Gallery deleted successfully");
  } catch (error) {
    return handleResponse(res, 500, "Error deleting gallery", { error: error.message });
  }
};

// const updateGalleryBySection = async (req, res) => {
//   try {
//     const { imageId, videoId } = req.params;
//     const {
//       gallery_image_title,
//       gallery_image_description,
//       gallery_video_title,
//       gallery_video_description,
//       remove_images,
//       remove_videos
//     } = req.body;

//     console.log("Received Image ID:", imageId);
//     console.log("Received Video ID:", videoId);
//     console.log("Received Remove Images:", remove_images);
//     console.log("Received Remove Videos:", remove_videos);

//     let gallery = await Gallery.findOne({
//       $or: [
//         { "gallery_image._id": imageId },
//         { "gallery_video._id": videoId }
//       ]
//     });

//     if (!gallery) {
//       console.log("Gallery not found!");
//       return handleResponse(res, 404, "Gallery section not found");
//     }

//     console.log("Gallery found:", gallery);

//     // 🔹 Handle Image Section Update
//     if (imageId && gallery.gallery_image._id.toString() === imageId) {
//       if (gallery_image_title) gallery.gallery_image.title = gallery_image_title;
//       if (gallery_image_description) gallery.gallery_image.description = gallery_image_description;

//       // Convert remove_images from string to array (if needed)
//       const removeImagesArray = typeof remove_images === "string" ? JSON.parse(remove_images) : remove_images;

//       if (removeImagesArray && Array.isArray(removeImagesArray)) {
//         console.log("Before Image Removal:", gallery.gallery_image.images);
//         console.log("Removing Images:", removeImagesArray);

//         gallery.gallery_image.images = gallery.gallery_image.images.filter(img => !removeImagesArray.includes(img));

//         console.log("After Image Removal:", gallery.gallery_image.images);
//       }

//       // Upload and add new images
//       if (req.files && req.files.images) {
//         const imageFiles = req.files.images;
//         const uploadedImages = await Promise.all(imageFiles.map(async (file) =>
//           cloudinary.uploadImageToCloudinary(file.buffer)
//         ));
//         gallery.gallery_image.images = [...gallery.gallery_image.images, ...uploadedImages];
//       }
//     }

//     // 🔹 Handle Video Section Update
//     if (videoId && gallery.gallery_video._id.toString() === videoId) {
//       if (gallery_video_title) gallery.gallery_video.title = gallery_video_title;
//       if (gallery_video_description) gallery.gallery_video.description = gallery_video_description;

//       // Convert remove_videos from string to array (if needed)
//       const removeVideosArray = typeof remove_videos === "string" ? JSON.parse(remove_videos) : remove_videos;

//       if (removeVideosArray && Array.isArray(removeVideosArray)) {
//         console.log("Before Video Removal:", gallery.gallery_video.videos);
//         console.log("Removing Videos:", removeVideosArray);

//         gallery.gallery_video.videos = gallery.gallery_video.videos.filter(vid => !removeVideosArray.includes(vid));

//         console.log("After Video Removal:", gallery.gallery_video.videos);
//       }

//       // Upload and add new videos
//       if (req.files && req.files.videos) {
//         const videoFiles = req.files.videos;
//         const uploadedVideos = await Promise.all(videoFiles.map(async (file) =>
//           cloudinary.uploadVideoToCloudinary(file.buffer)
//         ));
//         gallery.gallery_video.videos = [...gallery.gallery_video.videos, ...uploadedVideos];
//       }
//     }

//     await gallery.save();
//     console.log("Gallery successfully updated:", gallery);
//     return handleResponse(res, 200, "Gallery section updated successfully", { gallery });

//   } catch (error) {
//     console.log("Error updating gallery section:", error.message);
//     return handleResponse(res, 500, "Error updating gallery section", { error: error.message });
//   }
// };

const updateGalleryBySection = async (req, res) => {
  try {
    const { imageId, videoId } = req.params;
    const {
      gallery_image_title,
      gallery_image_description,
      gallery_video_title,
      gallery_video_description,
      remove_images,
      remove_videos,
    } = req.body;

    const gallery = await Gallery.findOne({
      $or: [{ "gallery_image._id": imageId }, { "gallery_video._id": videoId }],
    });

    if (!gallery) {
      console.log("Gallery not found!");
      return handleResponse(res, 404, "Gallery section not found");
    }

    let updatedData = {};

    if (imageId && gallery.gallery_image._id.toString() === imageId) {
      updatedData["gallery_image.title"] = gallery_image_title || gallery.gallery_image.title;
      updatedData["gallery_image.description"] = gallery_image_description || gallery.gallery_image.description;

      const removeImagesArray = typeof remove_images === "string" ? JSON.parse(remove_images) : remove_images;

      if (removeImagesArray && Array.isArray(removeImagesArray)) {
        updatedData["gallery_image.images"] = gallery.gallery_image.images.filter(
          (img) => !removeImagesArray.includes(img)
        );
      }

      if (req.convertedFiles && req.convertedFiles.images) {
        const newImages = req.convertedFiles.images;
        updatedData["gallery_image.images"] = [
          ...(updatedData["gallery_image.images"] || gallery.gallery_image.images),
          ...newImages,
        ];
      }
    }

    if (videoId && gallery.gallery_video._id.toString() === videoId) {
      updatedData["gallery_video.title"] = gallery_video_title || gallery.gallery_video.title;
      updatedData["gallery_video.description"] = gallery_video_description || gallery.gallery_video.description;

      const removeVideosArray = typeof remove_videos === "string" ? JSON.parse(remove_videos) : remove_videos;

      if (removeVideosArray && Array.isArray(removeVideosArray)) {
        updatedData["gallery_video.videos"] = gallery.gallery_video.videos.filter(
          (vid) => !removeVideosArray.includes(vid)
        );
      }

      if (req.convertedFiles && req.convertedFiles.videos) {
        const newVideos = req.convertedFiles.videos;
        updatedData["gallery_video.videos"] = [
          ...(updatedData["gallery_video.videos"] || gallery.gallery_video.videos),
          ...newVideos,
        ];
      }
    }

    const updatedGallery = await Gallery.findByIdAndUpdate(
      gallery._id,
      { $set: updatedData },
      { new: true, runValidators: true }
    );

    return handleResponse(res, 200, "Gallery section updated successfully", { gallery: updatedGallery });
  } catch (error) {
    console.log("Error updating gallery section:", error.message);
    return handleResponse(res, 500, "Error updating gallery section", { error: error.message });
  }
};


module.exports = {
  createOrUpdateGallery,
  getAllGallery,
  getGalleryById,
  updateGalleryById,
  deleteGalleryById,
  updateGalleryBySection
};

