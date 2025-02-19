const Mission = require("../../models/mission");
const cloudinary = require("../../middlewares/cloudinary");
const missionValidator = require("../../validators/missionValidators");
const { handleResponse } = require("../../utils/helper")
// Create a new Mission
const createMission = async (req, res) => {
  const { error } = missionValidator.validate(req.body);
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

    const { heading, text } = req.body;
    const newMission = new Mission({
      heading,
      text,
      images: imageUrls,
    });

    await newMission.save();

    return handleResponse(res, 201, "Mission created successfully", { mission: newMission });
  } catch (error) {
    return handleResponse(res, 500, "Error creating Mission", { error: error.message });
  }
};

// Get all Missions
const getAllMissions = async (req, res) => {
  try {
    const missions = await Mission.find().sort({ createdAt: -1 });
    return handleResponse(res, 200, "Missions fetched successfully", { missions });
  } catch (error) {
    return handleResponse(res, 500, "Error fetching Missions", { error: error.message });
  }
};

// Get Mission by ID
const getMissionById = async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id);
    if (!mission) {
        return handleResponse(res, 404, "Mission not found");
    }
    return handleResponse(res, 200, "Mission fetched successfully", { mission });
  } catch (error) {
    return handleResponse(res, 500, "Error fetching Mission", { error: error.message });
  }
};

// Update Mission (Admin Only)
const updateMission = async (req, res) => {
  const { error } = missionValidator.validate(req.body);
  if (error) {
    return handleResponse(res, 400, "Validation error", { errors: error.details });
  }

  try {
    const mission = await Mission.findById(req.params.id);
    if (!mission) {
        return handleResponse(res, 404, "Mission not found");
    }

    if (req.file) {
      mission.image = await cloudinary.uploadImageToCloudinary(req.file.buffer);
    }

    mission.heading = req.body.heading || mission.heading;
    mission.text = req.body.text || mission.text;

    await mission.save();
    return handleResponse(res, 200, "Mission updated successfully", { mission });
  } catch (error) {
    return handleResponse(res, 500, "Error updating Mission", { error: error.message });
  }
};

// Delete Mission (Admin Only)
const deleteMission = async (req, res) => {
  try {
    const mission = await Mission.findByIdAndDelete(req.params.id);
    if (!mission) {
        return handleResponse(res, 404, "Mission not found");
    }
    return handleResponse(res, 200, "Mission deleted successfully");
  } catch (error) {
    return handleResponse(res, 500, "Error deleting Mission", { error: error.message });
  }
};

module.exports = {
  createMission,
  getAllMissions,
  getMissionById,
  updateMission,
  deleteMission,
};
