const Event = require("../../models/event");
const { uploadImageToCloudinary } = require("../../middlewares/cloudinary");
const { handleResponse } = require("../../utils/helper");

exports.createEvent = async (req, res) => {
  try {
      const { title, description } = req.body;

      let bannerUrl = "";
      let imageGroups = [];

      if (req.files?.banner && req.files.banner.length > 0) {
          bannerUrl = await uploadImageToCloudinary(req.files.banner[0].buffer);
      }

      if (req.files?.images && req.files.images.length > 0) {
          for (let index = 0; index < req.files.images.length; index++) {
              const file = req.files.images[index];
              
              const imageTitle = req.body[`image_title_${index + 1}`] || `Image Title ${index + 1}`;
              const imageDescription = req.body[`image_description_${index + 1}`] || `Image Description ${index + 1}`;

              const imageUrl = await uploadImageToCloudinary(file.buffer);

              imageGroups.push({
                  image_title: imageTitle,
                  image_description: imageDescription,
                  images: [imageUrl]  
              });
          }
      }

      const newEvent = new Event({
          banner: bannerUrl,
          title,
          description,
          imageGroups
      });

      await newEvent.save();
      return handleResponse(res, 201, "Event created successfully", { newEvent });
  } catch (error) {
      console.error("Error:", error.message);
      return handleResponse(res, 500, error.message);
  }
};

exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find();
        return handleResponse(res, 200, "Events fetched successfully", { events });
    } catch (error) {
        return handleResponse(res, 500, error.message);
    }
};

exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return handleResponse(res, 404, "Event not found");
        return handleResponse(res, 200, "Event fetched successfully", { event });
    } catch (error) {
        return handleResponse(res, 500, error.message);
    }
};
/*
exports.updateEvent = async (req, res) => {
  try {
      const { title, description } = req.body;
      const { eventId } = req.params;  

      let bannerUrl = "";
      let imageGroups = [];

      const event = await Event.findById(eventId);

      if (!event) {
          return handleResponse(res, 404, "Event not found");
      }

      if (req.files?.banner && req.files.banner.length > 0) {
          bannerUrl = await uploadImageToCloudinary(req.files.banner[0].buffer);
          event.banner = bannerUrl;  
      }

      if (req.files?.images && req.files.images.length > 0) {
          for (let index = 0; index < req.files.images.length; index++) {
              const file = req.files.images[index];
              
              const imageTitle = req.body[`image_title_${index + 1}`] || `Image Title ${index + 1}`;
              const imageDescription = req.body[`image_description_${index + 1}`] || `Image Description ${index + 1}`;

              const imageUrl = await uploadImageToCloudinary(file.buffer);

              imageGroups.push({
                  image_title: imageTitle,
                  image_description: imageDescription,
                  images: [imageUrl]  
              });
          }
          event.imageGroups = imageGroups;  
      }

      if (title) event.title = title;
      if (description) event.description = description;

      await event.save();

      return handleResponse(res, 200, "Event updated successfully", { event });
  } catch (error) {
      console.error("Error:", error.message);
      return handleResponse(res, 500, error.message);
  }
};
*/

exports.updateEvent = async (req, res) => {
  try {
    const { title, description } = req.body;
    const { eventId } = req.params;

    let bannerUrl = "";
    let imageGroups = [];

    const event = await Event.findById(eventId);

    if (!event) {
      return handleResponse(res, 404, "Event not found");
    }

    if (req.files?.banner && req.files.banner.length > 0) {
      bannerUrl = await uploadImageToCloudinary(req.files.banner[0].buffer);
      event.banner = bannerUrl;
    }

    if (req.files?.images && req.files.images.length > 0) {
      for (let index = 0; index < req.files.images.length; index++) {
        const file = req.files.images[index];

        const imageTitle = req.body[`image_title_${index + 1}`] || `Image Title ${index + 1}`;
        const imageDescription = req.body[`image_description_${index + 1}`] || `Image Description ${index + 1}`;

        const imageUrl = await uploadImageToCloudinary(file.buffer);

        const newImageGroup = {
          image_title: imageTitle,
          image_description: imageDescription,
          images: [imageUrl],  
        };

        event.imageGroups.push(newImageGroup);
      }
    }

    if (title) event.title = title;
    if (description) event.description = description;

    await event.save();

    return handleResponse(res, 200, "Event updated successfully", { event });
  } catch (error) {
    console.error("Error:", error.message);
    return handleResponse(res, 500, error.message);
  }
};

exports.updateEventSection = async (req, res) => {
  try {
    const { eventId, sectionId } = req.params;  
    const { image_title, image_description, remove_images } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return handleResponse(res, 404, "Event not found");
    }

    const section = event.imageGroups.id(sectionId);
    if (!section) {
      return handleResponse(res, 404, "Section not found");
    }

    section.image_title = image_title || section.image_title;
    section.image_description = image_description || section.image_description;

    if (remove_images && remove_images.length > 0) {
      section.images = section.images.filter(
        (image) => !remove_images.includes(image)
      );
    }

    if (req.files && req.files.images && req.files.images.length > 0) {
      section.images = [];

      for (let i = 0; i < req.files.images.length; i++) {
        const file = req.files.images[i];  

        const imageUrl = await uploadImageToCloudinary(file.buffer);  

        section.images.push(imageUrl);
      }
    }

    await event.save();

    return handleResponse(res, 200, "Event section updated successfully", { updatedEvent: event });

  } catch (error) {
    console.error("Error:", error.message);
    return handleResponse(res, 500, error.message);
  }
};

exports.deleteEventSection = async (req, res) => {
  try {
    const { sectionId } = req.params;  

    const event = await Event.findOne({ "imageGroups._id": sectionId });
    if (!event) {
      return handleResponse(res, 404, "Event not found or Section not found in any event");
    }

    event.imageGroups = event.imageGroups.filter(section => section._id.toString() !== sectionId);

    await event.save();

    return handleResponse(res, 200, "Event section deleted successfully", { updatedEvent: event });

  } catch (error) {
    console.error("Error:", error.message);
    return handleResponse(res, 500, error.message);
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;  

    const event = await Event.findByIdAndDelete(eventId);
    if (!event) {
      return handleResponse(res, 404, "Event not found");
    }

    return handleResponse(res, 200, "Event deleted successfully", { deletedEvent: event });

  } catch (error) {
    console.error("Error:", error.message);
    return handleResponse(res, 500, error.message);
  }
};
