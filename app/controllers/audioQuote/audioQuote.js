const { handleResponse } = require("../../utils/helper");
const AudioQuote = require("../../models/audioQuote");
const path = require("path");
const fs = require("fs");

const createAudioQuote = async (req, res) => {
  try {
    const { heading, description, title } = req.body;

    const images = req.convertedFiles['audio_section_images'] || [];
    const audioFiles = req.convertedFiles['audio_section_audio'] || [];

    const audioSectionData = audioFiles.map((audioFile, index) => {
      return {
        title: title || `Audio Section ${index + 1}`,
        images: images[index] || '',
        audio: audioFile,
      };
    });

    const newAudioQuote = new AudioQuote({
      heading,
      description,
      audio_section: audioSectionData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await newAudioQuote.save();

    return handleResponse(res, 201, 'Audio quote created successfully', {
      id: newAudioQuote._id,
      heading: newAudioQuote.heading,
      description: newAudioQuote.description,
      audio_section: newAudioQuote.audio_section,
    });
  } catch (error) {
    console.error("Error creating audio quote:", error);
    return handleResponse(res, 500, error.message, {
      id: null,
      heading: null,
      description: null,
      audio_section: [],
    });
  }
};

const getAudioQuotes = async (req, res) => {
  try {
    const audioQuotes = await AudioQuote.find();

    if (audioQuotes.length === 0) {
      return handleResponse(res, 404, 'No audio quotes found', { data: [] });
    }

    return handleResponse(res, 200, 'Audio quotes retrieved successfully', { data: audioQuotes });
  } catch (error) {
    console.error("Error fetching audio quotes:", error);
    return handleResponse(res, 500, error.message, { data: [] });
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

const updateAudioQuotes = async (req, res) => {
  try {
    const { audioQuoteId } = req.params;
    const { heading, description, title } = req.body;

    const images = req.convertedFiles['audio_section_images'] || [];
    const audioFiles = req.convertedFiles['audio_section_audio'] || [];

    const audioQuote = await AudioQuote.findById(audioQuoteId);
    if (!audioQuote) {
      return handleResponse(res, 404, 'Audio quote not found', { data: null });
    }

    if (heading) audioQuote.heading = heading;
    if (description) audioQuote.description = description;

    if (audioFiles.length > 0 || images.length > 0) {
      const updatedSections = audioFiles.map((audioFile, index) => {
        return {
          title: title || `Audio Section ${index + 1}`,
          images: images[index] || '',
          audio: audioFile,
        };
      });

      updatedSections.forEach(newSection => {
        audioQuote.audio_section.push(newSection);
      });
    }

    await audioQuote.save();

    return handleResponse(res, 200, 'Audio quote updated successfully', {
      id: audioQuote._id,
      heading: audioQuote.heading,
      description: audioQuote.description,
      audio_section: audioQuote.audio_section,
    });
  } catch (error) {
    console.error("Error updating audio quote:", error);
    return handleResponse(res, 500, error.message, {
      id: null,
      heading: null,
      description: null,
      audio_section: [],
    });
  }
};

const updateAudioSection = async (req, res) => {
  try {
    const { audioQuoteId, sectionId } = req.params;
    const { heading, description, title } = req.body;

    const images = req.convertedFiles['audio_section_images'] || [];
    const audioFiles = req.convertedFiles['audio_section_audio'] || [];

    const audioQuote = await AudioQuote.findById(audioQuoteId);
    if (!audioQuote) {
      return handleResponse(res, 404, 'Audio quote not found', { data: null });
    }

    if (heading) audioQuote.heading = heading;
    if (description) audioQuote.description = description;

    if (sectionId) {
      const section = audioQuote.audio_section.id(sectionId);
      if (!section) {
        return handleResponse(res, 404, 'Section not found', { data: null });
      }

      if (title) section.title = title;

      if (audioFiles.length > 0) {
        section.audio = audioFiles[0];
      }

      if (images.length > 0) {
        section.images = images[0];
      }
    } else {
      audioQuote.audio_section.push({
        title: title || `Audio Section ${audioQuote.audio_section.length + 1}`,
        audio: audioFiles[0] || '',
        images: images[0] || '',
      });
    }

    await audioQuote.save();

    return handleResponse(res, 200, 'Audio quote section updated successfully', {
      id: audioQuote._id,
      heading: audioQuote.heading,
      description: audioQuote.description,
      audio_section: audioQuote.audio_section,
    });
  } catch (error) {
    console.error('Error updating audio section:', error);
    return handleResponse(res, 500, 'Internal server error', { data: [] });
  }
};

const deleteAudioSection = async (req, res) => {
  try {
    const { audioQuoteId, sectionId } = req.params;

    const audioQuote = await AudioQuote.findById(audioQuoteId);
    if (!audioQuote) {
      return handleResponse(res, 404, 'Audio quote not found', { data: null });
    }

    const sectionIndex = audioQuote.audio_section.findIndex(section => section._id.toString() === sectionId);

    if (sectionIndex === -1) {
      return handleResponse(res, 404, 'Audio section not found', { data: null });
    }

    audioQuote.audio_section.splice(sectionIndex, 1);

    await audioQuote.save();

    return handleResponse(res, 200, 'Audio section removed successfully', {});
  } catch (error) {
    console.error('Error removing audio section:', error);
    return handleResponse(res, 500, 'Internal server error', { data: [] });
  }
};

module.exports = {
  createAudioQuote,
  getAudioQuotes,
  getAudioQuotesById,
  updateAudioQuotes,
  updateAudioSection,
  deleteAudioSection
};