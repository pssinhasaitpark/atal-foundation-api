const Event = require("../../models/event");
const { uploadImageToCloudinary } = require("../../middlewares/cloudinary");
const { handleResponse } = require("../../utils/helper");

exports.createEvent = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    let imageGroups = [];
    const bannerUrl = req.convertedFiles?.banner?.[0];
    let imageUrls = req.convertedFiles?.images || [];

    for (let index = 0; index < req.files.images.length; index++) {
      const imageTitle = req.body[`image_title_${index + 1}`] || `Image Title ${index + 1}`;
      const imageDescription = req.body[`image_description_${index + 1}`] || `Image Description ${index + 1}`;
      imageGroups.push({
        image_title: imageTitle,
        image_description: imageDescription,
        images: imageUrls[index],
      });
    }

    const newEvent = new Event({
      banner: bannerUrl,
      title,
      description,
      imageGroups,
    });

    await newEvent.save();

    req.contentCreated = true;
    req.contentTitle = newEvent.title;
    req.contentType = "events"; 
    
    res.status(201).json({
      success: true,
      message: "Event created successfully!",
      data: newEvent,
    });

    next();
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
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

exports.updateEvent = async (req, res) => {
  try {
    const { title, description } = req.body;
    const { eventId } = req.params;

    if (!req.user || (req.user.user_role !== "admin" && req.user.user_role !== "super-admin")) {
      return handleResponse(res, 403, "Access denied: Admins only.");
    }

    let imageGroups = [];
    const updatedData = {};

    const bannerUrl = req.convertedFiles && req.convertedFiles.banner && req.convertedFiles.banner[0] ? req.convertedFiles.banner[0] : "";

    if (bannerUrl) {
      updatedData.banner = bannerUrl;
    }

    let imageUrls = [];
    if (req.convertedFiles && req.convertedFiles.images) {
      imageUrls = [...imageUrls, ...req.convertedFiles.images];
    }

    if (req.convertedFiles?.images && req.convertedFiles.images.length > 0) {
      for (let index = 0; index < req.convertedFiles.images.length; index++) {
        const imageTitle = req.body[`image_title_${index + 1}`] || `Image Title ${index + 1}`;
        const imageDescription = req.body[`image_description_${index + 1}`] || `Image Description ${index + 1}`;

        imageGroups.push({
          image_title: imageTitle,
          image_description: imageDescription,
          images: imageUrls[index]
        });
      }
      updatedData.$push = { imageGroups: { $each: imageGroups } };
    }

    if (title) updatedData.title = title;
    if (description) updatedData.description = description;

    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      updatedData,
      { new: true, runValidators: true }
    );

    if (!updatedEvent) {
      return handleResponse(res, 404, "Event not found");
    }

    return handleResponse(res, 200, "Event updated successfully", { event: updatedEvent });
  } catch (error) {
    console.error("Error:", error.message);
    return handleResponse(res, 500, error.message);
  }
};

// exports.updateEvent = async (req, res) => {
//   try {
//     const { title, description } = req.body;
//     const { eventId } = req.params;

//     let bannerUrl = "";
//     let imageGroups = [];

//     const event = await Event.findById(eventId);

//     if (!event) {
//       return handleResponse(res, 404, "Event not found");
//     }

//     if (req.files?.banner && req.files.banner.length > 0) {
//       bannerUrl = await uploadImageToCloudinary(req.files.banner[0].buffer);
//       event.banner = bannerUrl;
//     }

//     if (req.files?.images && req.files.images.length > 0) {
//       for (let index = 0; index < req.files.images.length; index++) {
//         const file = req.files.images[index];

//         const imageTitle = req.body[`image_title_${index + 1}`] || `Image Title ${index + 1}`;
//         const imageDescription = req.body[`image_description_${index + 1}`] || `Image Description ${index + 1}`;

//         const imageUrl = await uploadImageToCloudinary(file.buffer);

//         const newImageGroup = {
//           image_title: imageTitle,
//           image_description: imageDescription,
//           images: [imageUrl],  
//         };

//         event.imageGroups.push(newImageGroup);
//       }
//     }

//     if (title) event.title = title;
//     if (description) event.description = description;

//     await event.save();

//     return handleResponse(res, 200, "Event updated successfully", { event });
//   } catch (error) {
//     console.error("Error:", error.message);
//     return handleResponse(res, 500, error.message);
//   }
// };

// exports.updateEventSection = async (req, res) => {
//   try {
//     const { eventId, sectionId } = req.params;  
//     const { image_title, image_description, remove_images } = req.body;

//     const event = await Event.findById(eventId);
//     if (!event) {
//       return handleResponse(res, 404, "Event not found");
//     }

//     const section = event.imageGroups.id(sectionId);
//     if (!section) {
//       return handleResponse(res, 404, "Section not found");
//     }

//     section.image_title = image_title || section.image_title;
//     section.image_description = image_description || section.image_description;

//     if (remove_images && remove_images.length > 0) {
//       section.images = section.images.filter(
//         (image) => !remove_images.includes(image)
//       );
//     }

//     if (req.files && req.files.images && req.files.images.length > 0) {
//       section.images = [];

//       for (let i = 0; i < req.files.images.length; i++) {
//         const file = req.files.images[i];  

//         const imageUrl = await uploadImageToCloudinary(file.buffer);  

//         section.images.push(imageUrl);
//       }
//     }

//     await event.save();

//     return handleResponse(res, 200, "Event section updated successfully", { updatedEvent: event });

//   } catch (error) {
//     console.error("Error:", error.message);
//     return handleResponse(res, 500, error.message);
//   }
// };

exports.updateEventSection = async (req, res) => {
  try {
    const { eventId, sectionId } = req.params;
    const { image_title, image_description, remove_images } = req.body;

    if (!req.user || (req.user.user_role !== "admin" && req.user.user_role !== "super-admin")) {
      return handleResponse(res, 403, "Access denied: Admins only.");
    }

    const updateQuery = {};

    const event = await Event.findById(eventId);
    if (!event) {
      return handleResponse(res, 404, "Event not found");
    }

    const sectionIndex = event.imageGroups.findIndex(
      (section) => section._id.toString() === sectionId
    );

    if (sectionIndex === -1) {
      return handleResponse(res, 404, "Section not found");
    }

    const sectionPath = `imageGroups.${sectionIndex}`;

    if (image_title) {
      updateQuery[`${sectionPath}.image_title`] = image_title;
    }
    if (image_description) {
      updateQuery[`${sectionPath}.image_description`] = image_description;
    }

    if (remove_images && remove_images.length > 0) {
      const remainingImages = event.imageGroups[sectionIndex].images.filter(
        (image) => !remove_images.includes(image)
      );
      updateQuery[`${sectionPath}.images`] = remainingImages;
    }

    // if (req.files && req.files.images && req.files.images.length > 0) {
    //   const newImageUrls = await Promise.all(
    //     req.files.images.map(async (file) => await uploadImageToCloudinary(file.buffer))
    //   );

    //   updateQuery[`${sectionPath}.images`] = newImageUrls;
    // }

    let imageUrls = [];
    if (req.convertedFiles && req.convertedFiles.images) {
      imageUrls = [...imageUrls, ...req.convertedFiles.images];
    }
    console.log("imageUrls==", imageUrls);
    updateQuery[`${sectionPath}.images`] = imageUrls;

    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      { $set: updateQuery },
      { new: true, runValidators: true }
    );

    if (!updatedEvent) {
      return handleResponse(res, 404, "Event not found after update");
    }

    return handleResponse(res, 200, "Event section updated successfully", { updatedEvent });
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
