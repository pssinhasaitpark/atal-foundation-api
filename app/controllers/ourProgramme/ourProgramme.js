const ourProgramme = require("../../models/ourProgramme");
const cloudinary = require("../../middlewares/cloudinary");
const { handleResponse } = require("../../utils/helper");

const createOurProgramme = async (req, res) => {
  try {
    const { category, details } = req.body;
    const parsedDetails = Array.isArray(details) ? details : JSON.parse(details || "[]");

    // Access banner directly (no array needed)
    const banner = req.files?.banner ? req.files.banner[0] : null;
    const images = req.files?.images || [];
    const detailImages = req.files?.detailImages || [];

    console.log("req.files:", req.files); // Log to confirm all files

    // if (!parsedDetails || parsedDetails.length === 0) {
    //   return res.status(400).json({ message: "No details provided" });
    // }

    // Upload banner image if available
    const uploadedBanner = banner ? await cloudinary.uploadImageToCloudinary(banner.buffer) : null;
    console.log("uploadedBanner", uploadedBanner);

    // Upload other general images
    const uploadedImages = await Promise.all(
      images.map(async (image) => {
        try {
          const url = await cloudinary.uploadImageToCloudinary(image.buffer);
          return { url };
        } catch (err) {
          console.error("Error uploading image:", err);
          return null;
        }
      })
    ).then((results) => results.filter((image) => image !== null)); // Remove failed uploads

    // Upload detail images for each detail
    const detailsFormatted = await Promise.all(
      parsedDetails.map(async (detail, index) => {
        let detailImageUrls = [];

        // Check if detail has associated images
        if (detailImages[index] && Array.isArray(detailImages[index])) {
          // If detailImages[index] is an array, upload images
          detailImageUrls = await Promise.all(
            detailImages[index].map(async (image) => {
              try {
                const url = await cloudinary.uploadImageToCloudinary(image.buffer);
                return { url };
              } catch (error) {
                console.error(`Error uploading detail image for detail ${index + 1}:`, error);
                return null;
              }
            })
          ).then((results) => results.filter((img) => img !== null)); // Filter out null values
        } else if (detailImages[index] && detailImages[index].buffer) {
          // If it's a single image object instead of an array
          try {
            const url = await cloudinary.uploadImageToCloudinary(detailImages[index].buffer);
            detailImageUrls.push({ url });
          } catch (error) {
            console.error(`Error uploading single detail image for detail ${index + 1}:`, error);
          }
        }

        return {
          title: detail.title,
          description: detail.description,
          images: detailImageUrls, // Add uploaded detail images
        };
      })
    );

    // Create the new ourProgramme document
    const newOurProgramme = new ourProgramme({
      category,
      banner: uploadedBanner,
      details: detailsFormatted,
    });

    await newOurProgramme.save();

    return res.status(201).json({
      status: 201,
      message: "Our Programme created successfully!",
      ourProgramme: newOurProgramme,
    });
  } catch (error) {
    console.error("Error creating ourProgramme:", error);
    return res.status(500).json({
      status: 500,
      message: "Error creating ourProgramme",
      error: error.message,
    });
  }
};

const getourProgrammes = async (req, res) => {
  try {
    // Define the predefined category order
    const categoryOrder = [
      'Education',
      'Healthcare',
      'Livelihood',
      'Girl Child & Women Empowerment',
      'Privileged Children',
      'Civic Driven Change',
      'Social Entrepreneurship',
      'Special Support ourProgramme',
      'Special Interventions'
    ];

    // Fetch the programmes and sort them based on the categoryOrder
    const ourProgrammes = await ourProgramme.find().sort({ createdAt: -1 });

    // Sort the programmes according to the predefined category order
    const sortedProgrammes = ourProgrammes.sort((a, b) => {
      return categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category);
    });

    return handleResponse(res, 200, "ourProgrammes fetched successfully", {
      ourProgrammes: sortedProgrammes,
    });
  } catch (error) {
    return handleResponse(res, 500, "Error fetching ourProgrammes", {
      error: error.message,
    });
  }
};

const getByCategory = async (req, res) => {
  try {
    // Extract the category from query parameters (or params depending on your route structure)
    const { category } = req.params;

    // Find ourProgrammes that match the category
    const ourProgrammes = await ourProgramme.find({ category }).sort({ createdAt: -1 });

    if (ourProgrammes.length === 0) {
      return handleResponse(res, 404, `No programmes found for category: ${category}`, {
        ourProgrammes,
      });
    }

    return handleResponse(res, 200, `${category} programmes fetched successfully`, {
      ourProgrammes,
    });
  } catch (error) {
    return handleResponse(res, 500, "Error fetching ourProgrammes by category", {
      error: error.message,
    });
  }
};

const updateOurProgramme = async (req, res) => {
  try {
    const { category } = req.params;
    let { details } = req.body;

    console.log("Incoming Request Body:", JSON.stringify(req.body, null, 2));
    console.log("Incoming Files:", req.files);

    const parsedDetails = Array.isArray(details) ? details : JSON.parse(details || "[]");
    console.log("Parsed Details:", parsedDetails);

    const existingProgramme = await ourProgramme.findOne({ category });

    if (!existingProgramme) {
      return res.status(404).json({
        status: 404,
        message: "Our Programme not found",
      });
    }

    if (req.body.category) {
      return res.status(400).json({
        status: 400,
        message: "The category field is immutable and cannot be updated.",
      });
    }

    let uploadedBannerUrl = existingProgramme.banner;
    if (req.files?.banner) {
      console.log("Uploading banner image...");
      try {
        uploadedBannerUrl = await cloudinary.uploadImageToCloudinary(req.files.banner[0].buffer);
        console.log("Uploaded Banner:", uploadedBannerUrl);
      } catch (error) {
        console.error("Banner Upload Failed:", error);
      }
    }

    const detailImages = req.files?.detailImages || [];
    console.log("Uploaded Detail Images:", detailImages);

    if (parsedDetails && Array.isArray(parsedDetails)) {
      for (let i = 0; i < parsedDetails.length; i++) {
        const detail = parsedDetails[i];

        if (detail._id) {
          const index = existingProgramme.details.findIndex(
            (d) => d._id.toString() === detail._id
          );
          if (index !== -1) {
            existingProgramme.details[index].title = detail.title || existingProgramme.details[index].title;
            existingProgramme.details[index].description = detail.description || existingProgramme.details[index].description;

            console.log("Processing images for detail:", detail._id);

            if (!existingProgramme.details[index].images) {
              existingProgramme.details[index].images = [];
            }

            let newDetailImages = [];
            if (detailImages[i]) {
              if (Array.isArray(detailImages[i])) {
                newDetailImages = await Promise.all(
                  detailImages[i].map(async (image) => {
                    try {
                      const url = await cloudinary.uploadImageToCloudinary(image.buffer);
                      return { url };
                    } catch (err) {
                      console.error("Error uploading detail image:", err);
                      return null;
                    }
                  })
                );
              } else if (detailImages[i].buffer) {
                try {
                  const url = await cloudinary.uploadImageToCloudinary(detailImages[i].buffer);
                  newDetailImages.push({ url });
                } catch (err) {
                  console.error("Error uploading single detail image:", err);
                }
              }

              newDetailImages = newDetailImages.filter((img) => img !== null);
              existingProgramme.details[index].images = [
                ...existingProgramme.details[index].images,
                ...newDetailImages,
              ];
            }
          }
        } else {
          let newDetailImages = [];
          if (detailImages[i]) {
            if (Array.isArray(detailImages[i])) {
              newDetailImages = await Promise.all(
                detailImages[i].map(async (image) => {
                  try {
                    const url = await cloudinary.uploadImageToCloudinary(image.buffer);
                    return { url };
                  } catch (err) {
                    console.error("Error uploading detail image:", err);
                    return null;
                  }
                })
              );
            } else if (detailImages[i].buffer) {
              try {
                const url = await cloudinary.uploadImageToCloudinary(detailImages[i].buffer);
                newDetailImages.push({ url });
              } catch (err) {
                console.error("Error uploading single detail image:", err);
              }
            }
          }

          const newDetail = {
            title: detail.title,
            description: detail.description,
            images: newDetailImages.filter((img) => img !== null),
          };
          existingProgramme.details.push(newDetail);
        }
      }
    }

    existingProgramme.banner = uploadedBannerUrl;
    await existingProgramme.save();

    return res.status(200).json({
      status: 200,
      message: "Our Programme updated successfully",
      ourProgramme: existingProgramme,
    });
  } catch (error) {
    console.error("Error updating ourProgramme:", error);
    return res.status(500).json({
      status: 500,
      message: "Error updating ourProgramme",
      error: error.message,
    });
  }
};

const updateOurProgrammeById = async (req, res) => {
  try {
    const { category, detailId } = req.params;
    const { title, description, removeImages } = req.body;

    console.log("Incoming Request Body:", JSON.stringify(req.body, null, 2));
    console.log("Incoming Files:", req.files);

    // Parse removeImages safely (if provided as a JSON string)
    const imagesToRemove = removeImages ? JSON.parse(removeImages) : [];

    // Find existing programme by category
    const existingProgramme = await ourProgramme.findOne({ category });

    if (!existingProgramme) {
      return res.status(404).json({
        status: 404,
        message: "Our Programme not found",
      });
    }

    // Find the specific details section
    const detailIndex = existingProgramme.details.findIndex(
      (d) => d._id.toString() === detailId
    );

    if (detailIndex === -1) {
      return res.status(404).json({
        status: 404,
        message: "Detail section not found",
      });
    }

    const detailSection = existingProgramme.details[detailIndex];

    // Update title and description if provided
    if (title) detailSection.title = title;
    if (description) detailSection.description = description;

    // Remove images if requested
    if (imagesToRemove.length > 0) {
      detailSection.images = detailSection.images.filter(
        (img) => !imagesToRemove.includes(img.url)
      );
    }

    // Handle new detail images upload
    let newDetailImages = [];
    if (req.files?.detailImages) {
      const detailImages = req.files.detailImages;

      if (Array.isArray(detailImages)) {
        newDetailImages = await Promise.all(
          detailImages.map(async (image) => {
            try {
              return { url: await cloudinary.uploadImageToCloudinary(image.buffer) };
            } catch (err) {
              console.error("Error uploading detail image:", err);
              return null;
            }
          })
        );
      } else if (detailImages.buffer) {
        try {
          newDetailImages.push({ url: await cloudinary.uploadImageToCloudinary(detailImages.buffer) });
        } catch (err) {
          console.error("Error uploading single detail image:", err);
        }
      }

      // Remove null values and append new images
      newDetailImages = newDetailImages.filter((img) => img !== null);
      detailSection.images = [...detailSection.images, ...newDetailImages];
    }

    // Save the updated programme
    await existingProgramme.save();

    return res.status(200).json({
      status: 200,
      message: "Detail section updated successfully",
      updatedDetail: detailSection,
    });
  } catch (error) {
    console.error("Error updating detail section:", error);
    return res.status(500).json({
      status: 500,
      message: "Error updating detail section",
      error: error.message,
    });
  }
};

const deleteOurProgrammeSectionByID = async (req, res) => {
  try {
    const { category, detailId } = req.params;

    console.log("Deleting Detail Section:", { category, detailId });

    // Find existing programme by category
    const existingProgramme = await ourProgramme.findOne({ category });

    if (!existingProgramme) {
      return res.status(404).json({
        status: 404,
        message: "Our Programme not found",
      });
    }

    // Find index of the details section to delete
    const detailIndex = existingProgramme.details.findIndex(
      (d) => d._id.toString() === detailId
    );

    if (detailIndex === -1) {
      return res.status(404).json({
        status: 404,
        message: "Detail section not found",
      });
    }

    // Remove the detail section from the array
    existingProgramme.details.splice(detailIndex, 1);

    // Save the updated programme document
    await existingProgramme.save();

    return res.status(200).json({
      status: 200,
      message: "Detail section deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting detail section:", error);
    return res.status(500).json({
      status: 500,
      message: "Error deleting detail section",
      error: error.message,
    });
  }
};

const deleteOurProgrammeCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    console.log("Deleting Programme Category:", { categoryId });

    // Find the category by ObjectId
    const existingProgramme = await ourProgramme.findById(categoryId);

    if (!existingProgramme) {
      return res.status(404).json({
        status: 404,
        message: "Programme category not found",
      });
    }

    // Remove banner image from Cloudinary if it exists
    if (existingProgramme.banner) {
      try {
        await cloudinary.deleteImageFromCloudinary(existingProgramme.banner);
        console.log("Deleted Banner Image:", existingProgramme.banner);
      } catch (err) {
        console.error("Error deleting banner image from Cloudinary:", err);
      }
    }

    // Remove all detail images from Cloudinary
    for (const detail of existingProgramme.details) {
      if (detail.images && detail.images.length > 0) {
        await Promise.all(
          detail.images.map(async (image) => {
            try {
              await cloudinary.deleteImageFromCloudinary(image.url);
            } catch (err) {
              console.error("Error deleting detail image from Cloudinary:", err);
            }
          })
        );
      }
    }

    // Delete the category from the database
    await ourProgramme.findByIdAndDelete(categoryId);

    return res.status(200).json({
      status: 200,
      message: "Programme category deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting programme category:", error);
    return res.status(500).json({
      status: 500,
      message: "Error deleting programme category",
      error: error.message,
    });
  }
};

module.exports = {
  createOurProgramme,
  getourProgrammes,
  getByCategory,
  updateOurProgramme,
  updateOurProgrammeById,
  deleteOurProgrammeSectionByID,
  deleteOurProgrammeCategory
};
