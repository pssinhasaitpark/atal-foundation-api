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
/*
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
*/
/* title, description
const updateOurProgramme = async (req, res) => {
  try {
    const { category } = req.params; // Use category to identify the programme
    const { banner, details } = req.body; // Destructure banner and details from the request body

    // Find the existing ourProgramme by category
    const existingProgramme = await ourProgramme.findOne({ category });

    if (!existingProgramme) {
      return handleResponse(res, 404, "Our Programme not found", {
        message: "No programme found with the provided category.",
      });
    }

    // If the category is provided in the request body, reject the update since category is immutable
    if (req.body.category) {
      return handleResponse(res, 400, "Category cannot be changed", {
        message: "The category field is immutable and cannot be updated.",
      });
    }

    // Handle the banner update if provided
    let uploadedBannerUrl = existingProgramme.banner; // Keep existing banner if no new banner is uploaded
    if (banner) {
      // Upload the new banner image and get the URL
      const uploadedBanner = await cloudinary.uploadImageToCloudinary(banner.buffer);
      uploadedBannerUrl = uploadedBanner; // Set the new banner URL
    }

    // If details are provided, handle the changes
    if (details && Array.isArray(details)) {
      for (let detail of details) {
        if (detail._id) {
          // Update an existing detail (if _id is provided)
          const index = existingProgramme.details.findIndex(
            (d) => d._id.toString() === detail._id
          );
          if (index !== -1) {
            existingProgramme.details[index].title = detail.title || existingProgramme.details[index].title;
            existingProgramme.details[index].description = detail.description || existingProgramme.details[index].description;

            // Handle image updates if provided in detail
            if (detail.images && detail.images.length > 0) {
              // Upload each new image provided for the detail
              existingProgramme.details[index].images = await Promise.all(
                detail.images.map(async (image) => {
                  const uploadedImage = await cloudinary.uploadImageToCloudinary(image.buffer);
                  return { url: uploadedImage }; // Return the image URL
                })
              );
            }
          }
        } else {
          // If no _id, it's a new detail item, so push it to the details array
          const newDetail = {
            title: detail.title,
            description: detail.description,
            images: detail.images ? await Promise.all(detail.images.map(async (image) => {
              const uploadedImage = await cloudinary.uploadImageToCloudinary(image.buffer);
              return { url: uploadedImage };
            })) : [],
          };
          existingProgramme.details.push(newDetail); // Add the new detail to the programme
        }
      }
    }

    // Save the updated ourProgramme
    existingProgramme.banner = uploadedBannerUrl; // Ensure the banner is updated
    await existingProgramme.save();

    return handleResponse(res, 200, "Our Programme updated successfully", {
      ourProgramme: existingProgramme,
    });
  } catch (error) {
    console.error("Error updating ourProgramme:", error);
    return handleResponse(res, 500, "Error updating ourProgramme", {
      error: error.message,
    });
  }
};
*/
const updateOurProgramme = async (req, res) => {
  try {
    const { category } = req.params;
    const { details } = req.body;

    console.log("req.body:", req.body); // Log to check input data

    // Find existing programme by category
    const existingProgramme = await ourProgramme.findOne({ category });

    if (!existingProgramme) {
      return handleResponse(res, 404, "Our Programme not found", {
        message: "No programme found with the provided category.",
      });
    }

    // Reject update if category is being changed
    if (req.body.category) {
      return handleResponse(res, 400, "Category cannot be changed", {
        message: "The category field is immutable and cannot be updated.",
      });
    }

    // Handle banner image update
    let uploadedBannerUrl = existingProgramme.banner; // Keep existing banner if no new banner
    if (req.body.banner) {  // Assuming banner is sent as base64 string
      console.log("Uploading banner image...");
      const bannerData = req.body.banner;  // Get the base64 string

      // Upload to Cloudinary
      uploadedBannerUrl = await cloudinary.uploadImageToCloudinary(bannerData); // Use the base64 string directly
      console.log("Uploaded Banner:", uploadedBannerUrl);
    }

    // Handle details updates
    if (details && Array.isArray(details)) {
      for (let detail of details) {
        if (detail._id) {
          const index = existingProgramme.details.findIndex(
            (d) => d._id.toString() === detail._id
          );
          if (index !== -1) {
            existingProgramme.details[index].title = detail.title || existingProgramme.details[index].title;
            existingProgramme.details[index].description = detail.description || existingProgramme.details[index].description;

            console.log("Uploading images for detail:", detail._id);

            // Handle images in `detailImages` (base64 or URL)
            if (detail.detailImages && detail.detailImages.length > 0) {  // Handle `detailImages` instead of `images`
              const newImages = await Promise.all(
                detail.detailImages.map(async (image) => {
                  console.log("Processing image:", image);
                  if (image && image.url) {
                    // If it's base64, upload it to Cloudinary
                    if (image.url.startsWith('data:image')) {
                      console.log("Base64 Image detected, uploading...");
                      const uploadedImageUrl = await cloudinary.uploadImageToCloudinary(image.url);
                      console.log("Uploaded Image URL:", uploadedImageUrl);
                      return { url: uploadedImageUrl }; // Return image URL as JSON object
                    }

                    // If it's a URL, directly use it
                    return { url: image.url }; // Directly return the URL if it's already hosted elsewhere
                  } else {
                    console.log("Image has no valid URL or base64 data:", image);
                    return null; // Skip if no URL or base64
                  }
                })
              ).then((results) => results.filter((image) => image !== null)); // Remove null results

              console.log("New images uploaded:", newImages);

              // Append new images to existing detail images
              existingProgramme.details[index].detailImages = [ // Update `detailImages`
                ...existingProgramme.details[index].detailImages,
                ...newImages,
              ];
            }
          }
        } else {
          // If no _id, it's a new detail item, so push it to the details array
          const newDetail = {
            title: detail.title,
            description: detail.description,
            detailImages: detail.detailImages ? await Promise.all(detail.detailImages.map(async (image) => { // Handle `detailImages` for new details
              console.log("Uploading new detail image...");
              if (image && image.url) {
                if (image.url.startsWith('data:image')) {
                  // If base64, upload it to Cloudinary
                  const uploadedImageUrl = await cloudinary.uploadImageToCloudinary(image.url);
                  console.log("Uploaded Image URL:", uploadedImageUrl);
                  return { url: uploadedImageUrl }; // Return image URL as JSON object
                } else {
                  // If it's a URL, directly use it
                  return { url: image.url }; // Return URL if already hosted
                }
              } else {
                console.log("Image has no valid URL or base64 data:", image);
                return null; // Skip if no valid data
              }
            })) : [],
          };
          // Add the new detail to the programme
          existingProgramme.details.push(newDetail);
        }
      }
    }

    existingProgramme.banner = uploadedBannerUrl; // Ensure the banner is updated
    await existingProgramme.save();

    return handleResponse(res, 200, "Our Programme updated successfully", {
      ourProgramme: existingProgramme,
    });
  } catch (error) {
    console.error("Error updating ourProgramme:", error);
    return handleResponse(res, 500, "Error updating ourProgramme", {
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
  getByCategory,
  getourProgrammeById,
  updateOurProgramme,
  deleteourProgramme,
};
