const {Vision} = require("../../models");
const cloudinary = require("../../middlewares/cloudinary");
const { validationResult } = require("express-validator");

// const createVision = async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   try {
//     let imageUrls = [];
//     if (req.files && req.files.length > 0) {
//       const uploadPromises = req.files.map((file) =>
//         cloudinary.uploadImageToCloudinary(file.buffer)
//       );
//       imageUrls = await Promise.all(uploadPromises);
//     }
  
//     const { heading, text } = req.body;

//     const newVision = new Vision({
//       heading,
//       text,
//       image: imageUrls,
//     });

//     await newVision.save();

//     res
//       .status(201)
//       .json({ message: "Vision created successfully", vision: newVision });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error creating Vision", error: error.message });
//   }
// };

const createOrUpdateVision = async (req, res) => {
  try {
    // Validate request data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { heading, text } = req.body;
    const { id } = req.query; // Get ID from query parameters

    // Check if a vision with the given ID exists
    let existingVision = null;
    if (id) {
      existingVision = await Vision.findById(id);
    }

    let imageUrls = existingVision ? existingVision.image : []; // Keep existing images if updating

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        cloudinary.uploadImageToCloudinary(file.buffer)
      );
      imageUrls = await Promise.all(uploadPromises);
    }

    if (existingVision) {
      // Update the existing vision
      existingVision.set({
        heading: heading || existingVision.heading,
        text: text || existingVision.text,
        image: imageUrls,
      });

      await existingVision.save();
      return res.status(200).json({ message: "Vision updated successfully!", vision: existingVision.toObject() });
    } else {
      // Create a new vision
      const newVision = new Vision({
        heading,
        text,
        image: imageUrls,
      });

      await newVision.save();
      return res.status(201).json({ message: "Vision created successfully!", vision: newVision.toObject() });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error creating or updating vision", error: error.message });
  }
};

const getAllVision = async (req, res) => {
  try {
    const visions = await Vision.find().sort({ createdAt: -1 });
    res.status(200).json({ visions });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching Vision", error: error.message });
  }
};

const getVisionById = async (req, res) => {
  const { id } = req.params;

  try {
    const vision = await Vision.findById(id);
    if (!vision) {
      return res.status(404).json({ message: "Vision not found" });
    }
    res.status(200).json({ vision });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching Vision", error: error.message });
  }
};

const updateVision = async (req, res) => {
  const { id } = req.params;
  const { heading, text } = req.body;

  try {
    const vision = await Vision.findById(id);
    if (!vision) {
      return res.status(404).json({ message: "Vision not found" });
    }

    let imageUrls = vision.image;

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        cloudinary.uploadImageToCloudinary(file.buffer)
      );
      imageUrls = await Promise.all(uploadPromises);
    }

    vision.heading = heading || vision.heading;
    vision.text = text || vision.text;
    vision.image = imageUrls;

    await vision.save();

    res.status(200).json({ message: "Vision updated successfully", vision });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating Vision", error: error.message });
  }
};

const deleteVision = async (req, res) => {
  const { id } = req.params;

  try {
    const vision = await Vision.findByIdAndDelete(id);
    if (!vision) {
      return res.status(404).json({ message: "vision not found" });
    }
    res.status(200).json({ message: "vision deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting vision", error: error.message });
  }
};

module.exports = {
  createOrUpdateVision,
  getAllVision,
  getVisionById,
  updateVision,
  deleteVision,
};
