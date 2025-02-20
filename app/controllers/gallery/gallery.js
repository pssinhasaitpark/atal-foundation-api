const Gallery = require("../../models/gallery");
const cloudinary = require("../../middlewares/cloudinary");
const { galleryValidation } = require("../../validators/gallery");
const { handleResponse } = require("../../utils/helper");

const createGallery = async (req, res) => {
    const { error } = galleryValidation.validate(req.body);
    if (error) {
      return handleResponse(res, 400, "Validation error", { errors: error.details });
    }
  
    try {
      let imageUrls = [];
      if (req.files && req.files.length > 0) {
        const uploadPromises = req.files.map((file) =>
          cloudinary.uploadImageToCloudinary(file.buffer)
        );
        imageUrls = await Promise.all(uploadPromises);
      }
  
      const { title } = req.body;
      const newGallery = new Gallery({
        title,
        images: imageUrls,
      });
  
      await newGallery.save();
  
      return handleResponse(res, 201, "Gallery created successfully", { gallery: newGallery });
    } catch (error) {
      return handleResponse(res, 500, "Error creating gallery", { error: error.message });
    }
};
  
const getAllGallery = async (req, res) => {
  try {
    const galleries = await Gallery.find().sort({ createdAt: -1 });
    return handleResponse(res, 200, "Galleries fetched successfully", {
      galleries,
    });
  } catch (error) {
    return handleResponse(res, 500, "Error fetching galleries", {
      error: error.message,
    });
  }
};

const getGalleryById = async (req, res) => {
  try {
    const { id } = req.params;
    const gallery = await Gallery.findById(id);
    if (!gallery) {
      return handleResponse(res, 404, "Gallery not found");
    }
    return handleResponse(res, 200, "Gallery fetched successfully", {
      gallery,
    });
  } catch (error) {
    return handleResponse(res, 500, "Error fetching gallery", {
      error: error.message,
    });
  }
};

const updateGalleryById = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    let gallery = await Gallery.findById(id);
    if (!gallery) {
      return handleResponse(res, 404, "Gallery not found");
    }

    let imageUrls = gallery.images;
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        cloudinary.uploadImageToCloudinary(file.buffer)
      );
      imageUrls = await Promise.all(uploadPromises);
    }

    gallery.title = title || gallery.title;
    gallery.images = imageUrls;

    await gallery.save();

    return handleResponse(res, 200, "Gallery updated successfully", {
      gallery,
    });
  } catch (error) {
    return handleResponse(res, 500, "Error updating gallery", {
      error: error.message,
    });
  }
};

const deleteGalleryById = async (req, res) => {
  try {
    const { id } = req.params;
    const gallery = await Gallery.findByIdAndDelete(id);
    if (!gallery) {
      return handleResponse(res, 404, "Gallery not found");
    }
    return handleResponse(res, 200, "Gallery deleted successfully");
  } catch (error) {
    return handleResponse(res, 500, "Error deleting gallery", {
      error: error.message,
    });
  }
};

module.exports = {
  createGallery,
  getAllGallery,
  getGalleryById,
  updateGalleryById,
  deleteGalleryById,
};

