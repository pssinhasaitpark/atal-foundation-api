const mongoose = require("mongoose");
const SupportSpeaker = require("../../models/supportSpeaker");
const cloudinary = require("../../middlewares/cloudinary");
const { supportSpeakerValidation } = require("../../validators/supportSpeakers");
const { handleResponse } = require("../../utils/helper");

const createSupportSpeaker = async (req, res) => {
    try {
        const { error } = supportSpeakerValidation.validate(req.body);
        if (error) {
            return handleResponse(res, 400, "Validation error", {
                errors: error.details,
            });
        }

        const { name, post, location } = req.body;

        let imageUrls = [];

        if (req.files && req.files.images) {
            const imageFiles = req.files.images || [];

            if (imageFiles.length > 0) {
                const uploadImagePromises = imageFiles.map(async (file) =>
                    cloudinary.uploadImageToCloudinary(file.buffer)
                );
                const uploadedImages = await Promise.all(uploadImagePromises);
                imageUrls = uploadedImages.map((url) => ({ url }));
            }
        }

        const newSpeaker = new SupportSpeaker({
            _id: new mongoose.Types.ObjectId(),
            name,
            post,
            location,
            images: imageUrls,
        });

        await newSpeaker.save();

        return handleResponse(res, 201, "Support Speaker Created Successfully!", {
            supportSpeaker: newSpeaker.toObject(),
        });
    } catch (error) {
        return handleResponse(res, 500, "Error Creating Support Speaker", {
            error: error.message,
        });
    }
};

const getAllSupportSpeaker = async (req, res) => {
    try {
        const supportSpeakers = await SupportSpeaker.find();

        if (supportSpeakers.length === 0) {
            return handleResponse(res, 404, "No Support Speakers found");
        }

        return handleResponse(res, 200, "Support Speakers Retrieved Successfully", {
            supportSpeakers,
        });
    } catch (error) {
        return handleResponse(res, 500, "Error Fetching Support Speakers", {
            error: error.message,
        });
    }
};

const getSupportSpeakerById = async (req, res) => {
    try {
        const { id } = req.params;  // Get the ID from the URL parameters

        const supportSpeaker = await SupportSpeaker.findById(id);

        if (!supportSpeaker) {
            return handleResponse(res, 404, "Support Speaker not found");
        }

        return handleResponse(res, 200, "Support Speaker Retrieved Successfully", {
            supportSpeaker,
        });
    } catch (error) {
        return handleResponse(res, 500, "Error Fetching Support Speaker", {
            error: error.message,
        });
    }
};

const updateSupportSpeakerById = async (req, res) => {
    try {
        const { id } = req.params; // Get the ID from the URL parameters
        const { name, post, location } = req.body;

        // Find the existing support speaker by ID
        const supportSpeaker = await SupportSpeaker.findById(id);

        if (!supportSpeaker) {
            return handleResponse(res, 404, "Support Speaker not found");
        }

        let imageUrls = supportSpeaker.images || [];

        if (req.files && req.files.images) {
            const imageFiles = req.files.images || [];

            if (imageFiles.length > 0) {
                const uploadImagePromises = imageFiles.map(async (file) =>
                    cloudinary.uploadImageToCloudinary(file.buffer)
                );
                const uploadedImages = await Promise.all(uploadImagePromises);
                imageUrls = uploadedImages.map((url) => ({ url }));
            }
        }

        // Update fields only if provided
        supportSpeaker.name = name || supportSpeaker.name;
        supportSpeaker.post = post || supportSpeaker.post;
        supportSpeaker.location = location || supportSpeaker.location;
        supportSpeaker.images = imageUrls.length > 0 ? imageUrls : supportSpeaker.images;

        await supportSpeaker.save();

        return handleResponse(res, 200, "Support Speaker Updated Successfully", {
            supportSpeaker,
        });
    } catch (error) {
        return handleResponse(res, 500, "Error Updating Support Speaker", {
            error: error.message,
        });
    }
};

const deleteSupportSpeakerById = async (req, res) => {
    try {
        const { id } = req.params; // Get the ID from the URL parameters

        // Find and delete the support speaker by ID
        const supportSpeaker = await SupportSpeaker.findByIdAndDelete(id);

        if (!supportSpeaker) {
            return handleResponse(res, 404, "Support Speaker not found");
        }

        return handleResponse(res, 200, "Support Speaker Deleted Successfully");
    } catch (error) {
        return handleResponse(res, 500, "Error Deleting Support Speaker", {
            error: error.message,
        });
    }
};

module.exports = {
    createSupportSpeaker,
    getAllSupportSpeaker,
    getSupportSpeakerById,
    updateSupportSpeakerById,
    deleteSupportSpeakerById
};
