const { handleResponse } = require("../../utils/helper");
const AudioQuote = require("../../models/audioQuote");
const path = require("path");
const fs = require("fs");

const createAudioQuote = async (req, res, next) => {
  try {
    if (!req.file) {
      return handleResponse(res, 400, "No audio file uploaded.");
    }

    const filePath = path.join(__dirname, "../../uploads", req.file.originalname);

    fs.writeFileSync(filePath, req.file.buffer);

    const audioQuote = new AudioQuote({
      filePath: filePath,
    });

    await audioQuote.save();

    handleResponse(res, 200, "Audio file uploaded successfully.", {
      filePath,
      _id: audioQuote._id,
    });
  } catch (error) {
    console.error("Error uploading audio quote:", error);
    next(error);
  }
};

const getAudioQuotes = async (req, res, next) => {
  try {
    const audioQuotes = await AudioQuote.find();

    if (!audioQuotes || audioQuotes.length === 0) {
      return handleResponse(res, 404, "No audio quotes found.");
    }

    const formattedQuotes = audioQuotes.map((audioQuote) => ({
      _id: audioQuote._id,
      filePath: audioQuote.filePath,
    }));

    handleResponse(res, 200, "Audio quotes retrieved successfully.", { audioQuotes: formattedQuotes });
  } catch (error) {
    console.error("Error retrieving audio quotes:", error);
    next(error);
  }
};

const getAudioQuotesById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const audioQuote = await AudioQuote.findById(id);

    if (!audioQuote) {
      return handleResponse(res, 404, "Audio quote not found.");
    }

    handleResponse(res, 200, "Audio quote retrieved successfully.", {
      _id: audioQuote._id,
      filePath: audioQuote.filePath,
    });
  } catch (error) {
    console.error("Error retrieving audio quote by ID:", error);
    next(error);
  }
};
/*
const updateAudioQuoteById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let updatedData = {};

    // Check if a new audio file is uploaded
    if (req.file) {
      const filePath = path.join(__dirname, "../../uploads", req.file.originalname);

      // Write the new file to the directory
      fs.writeFileSync(filePath, req.file.buffer);

      // Add filePath to updatedData
      updatedData.filePath = filePath;
    }

    // Update the audio quote in the database
    const audioQuote = await AudioQuote.findByIdAndUpdate(id, updatedData, { new: true });

    if (!audioQuote) {
      return handleResponse(res, 404, "Audio quote not found.");
    }

    handleResponse(res, 200, "Audio quote updated successfully.", {
      _id: audioQuote._id,
      filePath: audioQuote.filePath,
    });
  } catch (error) {
    console.error("Error updating audio quote by ID:", error);
    next(error);
  }
};
*/

const updateAudioQuoteById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { user_role } = req.user;

    // Check if the user has permission to update
    if (user_role !== "admin" && user_role !== "super-admin") {
      return handleResponse(res, 403, "Access denied: Admins only.");
    }

    let updatedData = {};

    // Check if a new audio file is uploaded
    if (req.file) {
      const filePath = path.join(__dirname, "../../uploads", req.file.originalname);

      // Write the new file to the directory
      fs.writeFileSync(filePath, req.file.buffer);

      // Add filePath to updatedData
      updatedData.filePath = filePath;
    }

    // Update the audio quote in the database
    const audioQuote = await AudioQuote.findByIdAndUpdate(id, updatedData, { new: true });

    if (!audioQuote) {
      return handleResponse(res, 404, "Audio quote not found.");
    }

    handleResponse(res, 200, "Audio quote updated successfully.", {
      _id: audioQuote._id,
      filePath: audioQuote.filePath,
    });
  } catch (error) {
    console.error("Error updating audio quote by ID:", error);
    next(error);
  }
};

module.exports = { createAudioQuote, getAudioQuotes, getAudioQuotesById, updateAudioQuoteById};