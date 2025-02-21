const Event = require("../../models/event");
const cloudinary = require("../../middlewares/cloudinary");
const eventValidator = require("../../validators/event");
const { handleResponse } = require("../../utils/helper");

// const createEvent = async (req, res) => {
//   const { error } = eventValidator.validate(req.body);
//   if (error) {
//     return handleResponse(res, 400, error.details[0].message);
//   }

//   try {
//     let imageUrls = [];
//     if (req.files && req.files.length > 0) {
//       const uploadPromises = req.files.map((file) =>
//         cloudinary.uploadImageToCloudinary(file.buffer)
//       );
//       imageUrls = await Promise.all(uploadPromises);
//     }

//     const { title, location, description } = req.body;
//     const newEvent = new Event({
//       title,
//       location,
//       description,
//       images: imageUrls,
//     });

//     await newEvent.save();
//     return handleResponse(res, 201, "Event created successfully", { event: newEvent });
//   } catch (error) {
//     return handleResponse(res, 500, "Error creating Event", { error: error.message });
//   }
// };

// const createOrUpdateEvent = async (req, res) => {
//   try {
//     const { error } = eventValidator.validate(req.body);
//     if (error) {
//       return handleResponse(res, 400, error.details[0].message);
//     }

//     const { title, location, description } = req.body;
//     const { id } = req.query; 

//     let existingEvent = null;
//     if (id) {
//       existingEvent = await Event.findById(id);
//     }

//     let imageUrls = existingEvent ? existingEvent.images : []; 
//     if (req.files && req.files.length > 0) {
//       const uploadPromises = req.files.map((file) =>
//         cloudinary.uploadImageToCloudinary(file.buffer)
//       );
//       imageUrls = await Promise.all(uploadPromises);
//     }

//     if (existingEvent) {
//       existingEvent.set({
//         title: title || existingEvent.title,
//         location: location || existingEvent.location,
//         description: description || existingEvent.description,
//         images: imageUrls,
//       });

//       await existingEvent.save();
//       return handleResponse(res, 200, "Event updated successfully!", { event: existingEvent.toObject() });
//     } else {
//       const newEvent = new Event({
//         title,
//         location,
//         description,
//         images: imageUrls,
//       });

//       await newEvent.save();
//       return handleResponse(res, 201, "Event created successfully!", { event: newEvent.toObject() });
//     }
//   } catch (error) {
//     return handleResponse(res, 500, "Error creating or updating event", { error: error.message });
//   }
// };

// const createOrUpdateEvent = async (req, res) => {
//   try {
//     const { error } = eventValidator.validate(req.body);
//     if (error) {
//       return handleResponse(res, 400, error.details[0].message);
//     }

//     const { title, location, description } = req.body;
//     const { id } = req.query; 

//     let existingEvent = null;
//     if (id) {
//       existingEvent = await Event.findById(id);
//     }

//     let imageUrls = existingEvent ? [...existingEvent.images] : []; // Preserve old images

//     if (req.files && req.files.length > 0) {
//       const uploadPromises = req.files.map((file) =>
//         cloudinary.uploadImageToCloudinary(file.buffer)
//       );
//       const newImageUrls = await Promise.all(uploadPromises);
//       imageUrls = [...imageUrls, ...newImageUrls]; // Append new images to old ones
//     }

//     if (existingEvent) {
//       existingEvent.set({
//         title: title || existingEvent.title,
//         location: location || existingEvent.location,
//         description: description || existingEvent.description,
//         images: imageUrls,
//       });

//       await existingEvent.save();
//       return handleResponse(res, 200, "Event updated successfully!", { event: existingEvent.toObject() });
//     } else {
//       const newEvent = new Event({
//         title,
//         location,
//         description,
//         images: imageUrls,
//       });

//       await newEvent.save();
//       return handleResponse(res, 201, "Event created successfully!", { event: newEvent.toObject() });
//     }
//   } catch (error) {
//     return handleResponse(res, 500, "Error creating or updating event", { error: error.message });
//   }
// };

const createOrUpdateEvent = async (req, res) => {
  try {
    // Ensure removeImages is parsed properly
    let removeImages = [];
    if (req.body.removeImages) {
      try {
        removeImages = JSON.parse(req.body.removeImages); // Convert string to array
      } catch (error) {
        return handleResponse(res, 400, "Invalid removeImages format. Must be a JSON array.");
      }
    }

    // const { error } = eventValidator.validate(req.body);
    // if (error) {
    //   return handleResponse(res, 400, error.details[0].message);
    // }

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

    // ✅ Step 1: Remove selected images
    if (Array.isArray(removeImages)) {
      imageUrls = imageUrls.filter((img) => !removeImages.includes(img));
    }

    // ✅ Step 2: Upload new images and append to the list
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        cloudinary.uploadImageToCloudinary(file.buffer)
      );
      const newImageUrls = await Promise.all(uploadPromises);
      imageUrls.push(...newImageUrls);
    }

    if (existingEvent) {
      // ✅ Step 3: Update the existing event
      existingEvent.set({
        title: title || existingEvent.title,
        location: location || existingEvent.location,
        description: description || existingEvent.description,
        images: imageUrls, // Updated images list
      });

      await existingEvent.save();
      return handleResponse(res, 200, "Event updated successfully!", {
        event: existingEvent.toObject(),
      });
    } else {
      // ✅ Step 4: Create a new event
      const newEvent = new Event({
        title,
        location,
        description,
        images: imageUrls,
      });

      await newEvent.save();
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
