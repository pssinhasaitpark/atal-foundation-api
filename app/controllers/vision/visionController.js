const Vision = require("../../models/vision");
const cloudinary = require("../../middlewares/cloudinary");
const multer = require("../../middlewares/multer");
const { validationResult } = require("express-validator");

const createVision = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const file = req.file;
    const result = await cloudinary.uploader.upload(file.path);

    const { heading, text } = req.body;

    const newVision = new Vision({
      heading,
      text,
      image: result.secure_url,
    });

    await newVision.save();

    res
      .status(201)
      .json({ message: "Vision created successfully", vision: newVision });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating Vision", error: error.message });
  }
};

const getAllVision = async (req, res) => {
  try {
    const visions = await Vision.find();
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

    if (req.file) {
      const file = req.file;
      const result = await cloudinary.uploader.upload(file.path);
      vision.image = result.secure_url;
    }

    vision.heading = heading || vision.heading;
    vision.text = text || vision.text;

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
  createVision,
  getAllVision,
  getVisionById,
  updateVision,
  deleteVision,
};
