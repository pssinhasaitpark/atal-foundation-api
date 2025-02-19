const Event = require("../../models/event");
const cloudinary = require("../../middlewares/cloudinary");
const eventValidator = require("../../validators/eventValidators");
const { handleResponse } = require("../../utils/helper");

const createEvent = async (req, res) => {
  const { error } = eventValidator.validate(req.body);
  if (error) {
    return handleResponse(res, 400, error.details[0].message);
  }

  try {
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        cloudinary.uploadImageToCloudinary(file.buffer)
      );
      imageUrls = await Promise.all(uploadPromises);
    }

    const { title, location, description } = req.body;
    const newEvent = new Event({
      title,
      location,
      description,
      images: imageUrls,
    });

    await newEvent.save();
    return handleResponse(res, 201, "Event created successfully", { event: newEvent });
  } catch (error) {
    return handleResponse(res, 500, "Error creating Event", { error: error.message });
  }
};

const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    return handleResponse(res, 200, "Events fetched successfully", { events });
  } catch (error) {
    return handleResponse(res, 500, "Error fetching Events", { error: error.message });
  }
};

const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return handleResponse(res, 404, "Event not found");
    }
    return handleResponse(res, 200, "Event fetched successfully", { event });
  } catch (error) {
    return handleResponse(res, 500, "Error fetching Event", { error: error.message });
  }
};

const updateEvent = async (req, res) => {
  const { error } = eventValidator.validate(req.body);
  if (error) {
    return handleResponse(res, 400, error.details[0].message);
  }

  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return handleResponse(res, 404, "Event not found");
    }

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        cloudinary.uploadImageToCloudinary(file.buffer)
      );
      event.images = await Promise.all(uploadPromises);
    }

    event.title = req.body.title || event.title;
    event.location = req.body.location || event.location;
    event.description = req.body.description || event.description;

    await event.save();
    return handleResponse(res, 200, "Event updated successfully", { event });
  } catch (error) {
    return handleResponse(res, 500, "Error updating Event", { error: error.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return handleResponse(res, 404, "Event not found");
    }
    return handleResponse(res, 200, "Event deleted successfully");
  } catch (error) {
    return handleResponse(res, 500, "Error deleting Event", { error: error.message });
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};
