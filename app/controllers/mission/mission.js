const Mission = require("../../models/mission");
const cloudinary = require("../../middlewares/cloudinary");
const missionValidator = require("../../validators/mission");
const { handleResponse } = require("../../utils/helper")

// const createMission = async (req, res) => {
//   const { error } = missionValidator.validate(req.body);
//   if (error) {
//     return handleResponse(res, 400, "Validation error", { errors: error.details });
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
//     const newMission = new Mission({
//       heading,
//       text,
//       images: imageUrls,
//     });

//     await newMission.save();

//     return handleResponse(res, 201, "Mission created successfully", { mission: newMission });
//   } catch (error) {
//     return handleResponse(res, 500, "Error creating Mission", { error: error.message });
//   }
// };

const createOrUpdateMission = async (req, res) => {
  try {
    // Validate request data
    const { error } = missionValidator.validate(req.body);
    if (error) {
      return handleResponse(res, 400, "Validation error", { errors: error.details });
    }

    const { heading, text } = req.body;
    const { id } = req.query; // Get ID from query parameters

    // Check if a mission with the given ID exists
    let existingMission = null;
    if (id) {
      existingMission = await Mission.findById(id);
    }

    let imageUrls = existingMission ? existingMission.images : []; // Keep existing images if updating

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        cloudinary.uploadImageToCloudinary(file.buffer)
      );
      imageUrls = await Promise.all(uploadPromises);
    }

    if (existingMission) {
      // Update the existing mission
      existingMission.set({
        heading: heading || existingMission.heading,
        text: text || existingMission.text,
        images: imageUrls,
      });

      await existingMission.save();
      return handleResponse(res, 200, "Mission updated successfully!", { mission: existingMission.toObject() });
    } else {
      // Create a new mission
      const newMission = new Mission({
        heading,
        text,
        images: imageUrls,
      });

      await newMission.save();
      return handleResponse(res, 201, "Mission created successfully!", { mission: newMission.toObject() });
    }
  } catch (error) {
    return handleResponse(res, 500, "Error creating or updating mission", { error: error.message });
  }
};

const getAllMissions = async (req, res) => {
  try {
    const missions = await Mission.find().sort({ createdAt: -1 });
    return handleResponse(res, 200, "Missions fetched successfully", { missions });
  } catch (error) {
    return handleResponse(res, 500, "Error fetching Missions", { error: error.message });
  }
};

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

    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        cloudinary.uploadImageToCloudinary(file.buffer)
      );
      imageUrls = await Promise.all(uploadPromises);
    }

    mission.heading = req.body.heading || mission.heading;
    mission.text = req.body.text || mission.text;
    mission.images=imageUrls;

    await mission.save();
    return handleResponse(res, 200, "Mission updated successfully", { mission });
  } catch (error) {
    return handleResponse(res, 500, "Error updating Mission", { error: error.message });
  }
};

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
  createOrUpdateMission,
  getAllMissions,
  getMissionById,
  updateMission,
  deleteMission,
};
