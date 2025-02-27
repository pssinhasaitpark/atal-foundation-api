const ourProgramme = require("../../models/ourProgramme");
const cloudinary = require("../../middlewares/cloudinary");
const { handleResponse } = require("../../utils/helper");
const createOurProgramme = async (req, res) => {
  try {
    const { category, details } = req.body;

    const banner = req.files.banner ? req.files.banner[0] : null;
    const images = req.files.images || [];

    // Upload the banner image to Cloudinary if it exists
    const uploadedBanner = banner ? await cloudinary.uploadImageToCloudinary(banner.buffer) : null;

    // Upload the main images
    const uploadedImages = await Promise.all(
      images.map(async (image) => ({
        url: await cloudinary.uploadImageToCloudinary(image.buffer),
      }))
    );

    console.log('Uploaded Images:', uploadedImages);

    // Format the details with async handling
    const detailsFormatted = await Promise.all(
      details.map(async (detail) => {
        const detailImages = detail.images || [];

        // Upload images for each detail if they exist
        const uploadedDetailImages = await Promise.all(
          detailImages.map(async (image) => {
            if (image.buffer) { // Check if the image buffer exists
              return {
                url: await cloudinary.uploadImageToCloudinary(image.buffer),
                title: image.title || '',
                description: image.description || '',
              };
            }
            return null; // Return null if no buffer exists
          })
        );

        return {
          title: detail.title,
          description: detail.description,
          images: uploadedDetailImages.filter(image => image !== null), // Filter out nulls
        };
      })
    );

    const newourProgramme = new ourProgramme({
      category,
      banner: uploadedBanner,
      details: detailsFormatted,
    });

    await newourProgramme.save();
    return res.status(201).json({
      status: 201,
      message: "ourProgramme created successfully!",
      ourProgramme: newourProgramme,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Error creating ourProgramme",
      error: error.message,
    });
  }
};


const getourProgrammes = async (req, res) => {
  try {
    const ourProgrammes = await ourProgramme.find().sort({ createdAt: -1 });
    return handleResponse(res, 200, "ourProgrammes fetched successfully", {
      ourProgrammes,
    });
  } catch (error) {
    return handleResponse(res, 500, "Error fetching ourProgrammes", {
      error: error.message,
    });
  }
};

const getourProgrammeById = async (req, res) => {
  try {
    const ourProgramme = await ourProgramme.findById(req.params.id);
    if (!ourProgramme) {
      return handleResponse(res, 404, "ourProgramme not found");
    }
    return handleResponse(res, 200, "ourProgramme fetched successfully", {
      ourProgramme,
    });
  } catch (error) {
    return handleResponse(res, 500, "Error fetching ourProgramme", {
      error: error.message,
    });
  }
};

const updateourProgramme = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, banner, details } = req.body;

    const ourProgramme = await ourProgramme.findById(id);
    if (!ourProgramme) {
      return res
        .status(404)
        .json({ status: 404, message: "ourProgramme not found" });
    }

    if (banner) {
      const uploadedBanner = await cloudinary.uploadImageToCloudinary(
        banner[0].buffer
      );
      ourProgramme.banner = uploadedBanner;
    }

    ourProgramme.category = category;
    ourProgramme.details = details.map((detail) => ({
      title: detail.title,
      description: detail.description,
      images: detail.images.map((image) => ({
        url: image.url,
        title: image.title,
        description: image.description,
      })),
    }));

    await ourProgramme.save();
    return res.status(200).json({
      status: 200,
      message: "ourProgramme updated successfully",
      ourProgramme,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Error updating ourProgramme",
      error: error.message,
    });
  }
};

const deleteourProgramme = async (req, res) => {
  try {
    const ourProgramme = await ourProgramme.findByIdAndDelete(req.params.id);
    if (!ourProgramme) {
      return handleResponse(res, 404, "ourProgramme not found");
    }
    return handleResponse(res, 200, "ourProgramme deleted successfully");
  } catch (error) {
    return handleResponse(res, 500, "Error deleting ourProgramme", {
      error: error.message,
    });
  }
};

module.exports = {
  createOurProgramme,
  getourProgrammes,
  getourProgrammeById,
  updateourProgramme,
  deleteourProgramme,
};
