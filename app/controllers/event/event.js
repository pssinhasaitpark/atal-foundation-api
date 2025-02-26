const Event = require("../../models/event");
const cloudinary = require("../../middlewares/cloudinary");
const eventValidator = require("../../validators/event");
const { handleResponse } = require("../../utils/helper");

/*
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

    const uploadedImages = req.files?.images || [];  // ✅ Fixed way to access images

    if (uploadedImages.length > 0) {
      console.log("Uploading images to Cloudinary...", uploadedImages.length);
      const uploadPromises = uploadedImages.map((file) =>
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
        event: existingEvent.toObject({ virtuals: true }),
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
        event: newEvent.toObject({ virtuals: true }),
      });
    }
  } catch (error) {
    return handleResponse(res, 500, "Error creating or updating event", {
      error: error.message,
    });
  }
};
*/

const createOrUpdateEvent = async (req, res, next) => {
  try {
    let removeImages = [];
    let removeVideos = [];
    
    // Handling images to remove
    if (req.body.removeImages) {
      try {
        removeImages = JSON.parse(req.body.removeImages); 
      } catch (error) {
        return handleResponse(res, 400, "Invalid removeImages format. Must be a JSON array.");
      }
    }

    // Handling videos to remove
    if (req.body.removeVideos) {
      try {
        removeVideos = JSON.parse(req.body.removeVideos);
      } catch (error) {
        return handleResponse(res, 400, "Invalid removeVideos format. Must be a JSON array.");
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
    let videoUrls = existingEvent ? [...existingEvent.videos] : []; // For videos

    // Remove specified images
    if (Array.isArray(removeImages)) {
      imageUrls = imageUrls.filter((img) => !removeImages.includes(img));
    }

    // Remove specified videos
    if (Array.isArray(removeVideos)) {
      videoUrls = videoUrls.filter((vid) => !removeVideos.includes(vid));
    }

    // Upload new images
    const uploadedImages = req.files?.images || [];
    if (uploadedImages.length > 0) {
      console.log("Uploading images to Cloudinary...", uploadedImages.length);
      const uploadImagePromises = uploadedImages.map((file) =>
        cloudinary.uploadImageToCloudinary(file.buffer)
      );
      const newImageUrls = await Promise.all(uploadImagePromises);
      imageUrls.push(...newImageUrls);
    }

    // Upload new videos
    const uploadedVideos = req.files?.videos || []; // Ensure you're handling video uploads
    if (uploadedVideos.length > 0) {
      console.log("Uploading videos to Cloudinary...", uploadedVideos.length);
      const uploadVideoPromises = uploadedVideos.map((file) =>
        cloudinary.uploadVideoToCloudinary(file.buffer) // Ensure you have a method to upload videos
      );
      const newVideoUrls = await Promise.all(uploadVideoPromises);
      videoUrls.push(...newVideoUrls);
    }

    if (existingEvent) {
      existingEvent.set({
        title: title || existingEvent.title,
        location: location || existingEvent.location,
        description: description || existingEvent.description,
        images: imageUrls, 
        videos: videoUrls, // Add the videos to the event
      });

      await existingEvent.save();
      req.contentCreated = true; 
      req.contentTitle = existingEvent.title; 

      next(); 

      return handleResponse(res, 200, "Event updated successfully!", {
        event: existingEvent.toObject({ virtuals: true }),
      });
    } else {
      const newEvent = new Event({
        title,
        location,
        description,
        images: imageUrls,
        videos: videoUrls, // Add the videos to the new event
      });

      await newEvent.save();
      req.contentCreated = true; 
      req.contentTitle = newEvent.title; 

      next(); 

      return handleResponse(res, 201, "Event created successfully!", {
        event: newEvent.toObject({ virtuals: true }),
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

