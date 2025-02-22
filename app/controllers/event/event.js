const Event = require("../../models/event");
const cloudinary = require("../../middlewares/cloudinary");
const eventValidator = require("../../validators/event");
const { handleResponse } = require("../../utils/helper");

const createOrUpdateEvent = async (req, res, next) => {
  try {
    let removeImages = [];
    if (req.body.removeImages) {
      try {
        removeImages = JSON.parse(req.body.removeImages); 
      } catch (error) {
        return handleResponse(res, 400, "Invalid removeImages format. Must be a JSON array.");
      }
    }

    const { title, location, description } = req.body;
    const { id } = req.query;

    let existingEvent = null;
    if (id) {
      existingEvent = await Event.findById(id);
      if (!existingEvent) {
        return handleResponse(res, 404, "Event not found");
      }
    }

    let imageUrls = existingEvent ? [...existingEvent.images] : [];

    if (Array.isArray(removeImages)) {
      imageUrls = imageUrls.filter((img) => !removeImages.includes(img));
    }

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        cloudinary.uploadImageToCloudinary(file.buffer)
      );
      const newImageUrls = await Promise.all(uploadPromises);
      imageUrls.push(...newImageUrls);
    }

    if (existingEvent) {
      existingEvent.set({
        title: title || existingEvent.title,
        location: location || existingEvent.location,
        description: description || existingEvent.description,
        images: imageUrls, 
      });

      await existingEvent.save();
      req.contentCreated = true; 
      req.contentTitle = existingEvent.title; 

      next(); 

      return handleResponse(res, 200, "Event updated successfully!", {
        event: existingEvent.toObject(),
      });
    } else {
      const newEvent = new Event({
        title,
        location,
        description,
        images: imageUrls,
      });

      await newEvent.save();
      req.contentCreated = true; 
      req.contentTitle = newEvent.title; 

      next(); 

      return handleResponse(res, 201, "Event created successfully!", {
        event: newEvent.toObject(),
      });
    }
  } catch (error) {
    return handleResponse(res, 500, "Error creating or updating event", {
      error: error.message,
    });
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
  createOrUpdateEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};
