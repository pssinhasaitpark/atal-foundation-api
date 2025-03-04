
// const Event = require("../../models/event");
// const cloudinary = require("../../middlewares/cloudinary");
// const eventValidator = require("../../validators/event");
// const { handleResponse } = require("../../utils/helper");
// const mongoose= require("mongoose");
// /*
// const createOrUpdateEvent = async (req, res) => {
//   try {
//     const { image_title, image_description, video_title, video_description } = req.body;

//     const banner = req.files?.banner
//       ? await cloudinary.uploadImageToCloudinary(req.files.banner[0].buffer)
//       : null;

//     if (!banner) {
//       return res.status(400).json({ status: 400, message: "Banner image is required" });
//     }

//     let imagesArray = [];
//     if (req.files?.images) {
//       for (let i = 0; i < req.files.images.length; i++) {
//         const file = req.files.images[i];
//         const title = req.body[`image${i + 1}_title`]; // Adjust based on naming convention
//         const description = req.body[`image${i + 1}_description`];

//         const imageUrl = await cloudinary.uploadImageToCloudinary(file.buffer);
//         imagesArray.push({
//           url: imageUrl,
//           title: title,
//           description: description,
//         });
//       }
//     }

//     let videoUrls = [];
//     if (req.files?.videos) {
//       const uploadVideoPromises = req.files.videos.map((file) =>
//         cloudinary.uploadVideoToCloudinary(file.buffer)
//       );
//       videoUrls = await Promise.all(uploadVideoPromises);
//     }

//     const newEvent = new Event({
//       banner,
//       imagesSection: {
//         image_title,
//         image_description,
//         images: imagesArray,
//       },
//       videosSection: {
//         video_title,
//         video_description,
//         videos: videoUrls,
//       },
//     });

//     await newEvent.save();

//     return res.status(201).json({
//       status: 201,
//       message: "Event created successfully!",
//       _id: newEvent._id,
//       banner: newEvent.banner,
//       event: {
//         imagesSection: newEvent.imagesSection,
//         videosSection: newEvent.videosSection,
//         created_at: newEvent.createdAt,
//         updated_at: newEvent.updatedAt,
//         __v: newEvent.__v,
//       },
//     });
//   } catch (error) {
//     return res.status(500).json({
//       status: 500,
//       message: "Error creating event",
//       error: error.message,
//     });
//   }
// };
// */

// const createOrUpdateEvent = async (req, res) => {
//   try {
//     const { image_title, image_description, video_title, video_description } = req.body;

//     // Upload Banner Image
//     const banner = req.files?.banner
//       ? await cloudinary.uploadImageToCloudinary(req.files.banner[0].buffer)
//       : null;

//     if (!banner) {
//       return res.status(400).json({ status: 400, message: "Banner image is required" });
//     }

//     // Upload Images
//     let imagesArray = [];
//     if (req.files?.images) {
//       for (let i = 0; i < req.files.images.length; i++) {
//         const file = req.files.images[i];
//         const title = req.body[`image${i + 1}_title`] || `Image ${i + 1}`;
//         const description = req.body[`image${i + 1}_description`] || "";

//         const imageUrl = await cloudinary.uploadImageToCloudinary(file.buffer);
//         imagesArray.push({
//           _id: new mongoose.Types.ObjectId(),
//           url: imageUrl,
//           title,
//           description,
//         });
//       }
//     }

//     // Upload Videos
//     let videoArray = [];
//     if (req.files?.videos) {
//       for (let i = 0; i < req.files.videos.length; i++) {
//         const file = req.files.videos[i];
//         const title = req.body[`video${i + 1}_title`] || `Video ${i + 1}`;
//         const description = req.body[`video${i + 1}_description`] || "";

//         const videoUrl = await cloudinary.uploadVideoToCloudinary(file.buffer);
//         videoArray.push({
//           _id: new mongoose.Types.ObjectId(),
//           url: videoUrl,
//           title,
//           description,
//         });
//       }
//     }

//     // Create Event Object
//     const newEvent = new Event({
//       banner,
//       imagesSection: {
//         image_title,
//         image_description,
//         images: imagesArray,
//       },
//       videosSection: {
//         video_title,
//         video_description,
//         videos: videoArray,
//       },
//     });

//     // Save Event to Database
//     await newEvent.save();

//     return res.status(201).json({
//       status: 201,
//       message: "Event created successfully!",
//       _id: newEvent._id,
//       banner: newEvent.banner,
//       event: {
//         imagesSection: newEvent.imagesSection,
//         videosSection: newEvent.videosSection,
//         createdAt: newEvent.createdAt,
//         updatedAt: newEvent.updatedAt,
//         __v: newEvent.__v,
//       },
//     });
//   } catch (error) {
//     return res.status(500).json({
//       status: 500,
//       message: "Error creating event",
//       error: error.message,
//     });
//   }
// };

// const getEvents = async (req, res) => {
//   try {
//     const events = await Event.find().sort({ createdAt: -1 });
//     return handleResponse(res, 200, "Events fetched successfully", { events });
//   } catch (error) {
//     return handleResponse(res, 500, "Error fetching Events", { error: error.message });
//   }
// };

// const getEventById = async (req, res) => {
//   try {
//     const event = await Event.findById(req.params.id);
//     if (!event) {
//       return handleResponse(res, 404, "Event not found");
//     }
//     return handleResponse(res, 200, "Event fetched successfully", { event });
//   } catch (error) {
//     return handleResponse(res, 500, "Error fetching Event", { error: error.message });
//   }
// };

// const updateEvent = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { 
//       image_title, image_description, video_title, video_description, 
//       remove_images, remove_videos, remove_banner 
//     } = req.body;

//     const event = await Event.findById(id);
//     if (!event) {
//       return res.status(404).json({ status: 404, message: "Event not found" });
//     }

//     if (remove_banner === "true" && event.banner) {
//       const publicId = event.banner.split("/").pop().split(".")[0]; 
//       await cloudinary.uploader.destroy(publicId); 
//       event.banner = ""; 
//     }

//     if (req.files?.banner) {
//       event.banner = await cloudinary.uploadImageToCloudinary(req.files.banner[0].buffer);
//     }

//     if (image_title) event.imagesSection.image_title = image_title;
//     if (image_description) event.imagesSection.image_description = image_description;

//     let removeImagesArray = [];
//     if (remove_images) {
//       try {
//         removeImagesArray = JSON.parse(remove_images);
//       } catch (error) {
//         return res.status(400).json({ status: 400, message: "Invalid remove_images format. Must be an array." });
//       }
//       event.imagesSection.images = event.imagesSection.images.filter(img => !removeImagesArray.includes(img.url));
//     }

//     if (req.files?.images) {
//       for (let i = 0; i < req.files.images.length; i++) {
//         const file = req.files.images[i];
//         const title = req.body[`image${i + 1}_title`];
//         const description = req.body[`image${i + 1}_description`];

//         const imageUrl = await cloudinary.uploadImageToCloudinary(file.buffer);
//         event.imagesSection.images.push({
//           url: imageUrl,
//           title: title,
//           description: description,
//         });
//       }
//     }

//     if (video_title) event.videosSection.video_title = video_title;
//     if (video_description) event.videosSection.video_description = video_description;

//     let removeVideosArray = [];
//     if (remove_videos) {
//       try {
//         removeVideosArray = JSON.parse(remove_videos);
//       } catch (error) {
//         return res.status(400).json({ status: 400, message: "Invalid remove_videos format. Must be an array." });
//       }
//       event.videosSection.videos = event.videosSection.videos.filter(video => !removeVideosArray.includes(video));
//     }

//     if (req.files?.videos) {
//       const uploadedVideos = await Promise.all(
//         req.files.videos.map((file) => cloudinary.uploadVideoToCloudinary(file.buffer))
//       );
//       event.videosSection.videos.push(...uploadedVideos);
//     }

//     await event.save();
//     return res.status(200).json({ status: 200, message: "Event updated successfully", event });

//   } catch (error) {
//     return res.status(500).json({ status: 500, message: "Error updating event", error: error.message });
//   }
// };

// const deleteEvent = async (req, res) => {
//   try {
//     const event = await Event.findByIdAndDelete(req.params.id);
//     if (!event) {
//       return handleResponse(res, 404, "Event not found");
//     }
//     return handleResponse(res, 200, "Event deleted successfully");
//   } catch (error) {
//     return handleResponse(res, 500, "Error deleting Event", { error: error.message });
//   }
// };
// /*
// const updateImageSection = async (req, res) => {
//   try {
//     const { imageSectionId } = req.params;
//     const { image_title, image_description, remove_images } = req.body;

//     const event = await Event.findOne({ "imagesSection._id": imageSectionId });
//     if (!event) {
//       return res.status(404).json({ status: 404, message: "Image section not found" });
//     }

//     if (image_title) event.imagesSection.image_title = image_title;
//     if (image_description) event.imagesSection.image_description = image_description;

//     let removeImagesArray = [];
//     if (remove_images) {
//       try {
//         removeImagesArray = JSON.parse(remove_images); 
//       } catch (error) {
//         return res.status(400).json({ status: 400, message: "Invalid remove_images format. Must be an array." });
//       }
//     }

//     if (removeImagesArray.length > 0) {
//       event.imagesSection.images = event.imagesSection.images.filter(img => !removeImagesArray.includes(img.url));
//     }

//     if (req.files?.images) {
//       const uploadedImages = await Promise.all(
//         req.files.images.map((file) => {
//           const title = req.body[`image${i + 1}_title`];
//           const description = req.body[`image${i + 1}_description`];
//           return cloudinary.uploadImageToCloudinary(file.buffer).then(imageUrl => ({
//             url: imageUrl,
//             title: title,
//             description: description,
//           }));
//         })
//       );
//       event.imagesSection.images.push(...uploadedImages);
//     }

//     await event.save();
//     return res.status(200).json({ status: 200, message: "Image section updated successfully", imagesSection: event.imagesSection });
//   } catch (error) {
//     return res.status(500).json({ status: 500, message: "Error updating image section", error: error.message });
//   }
// };
// */

// const updateImageSection = async (req, res) => {
//   try {
//     const { eventId } = req.params; // Event ID from request params
//     const { image_title, image_description, updated_images, remove_images } = req.body;

//     // 🔹 Step 1: Find the event
//     const event = await Event.findById(eventId);
//     if (!event) {
//       return res.status(404).json({ status: 404, message: "Event not found" });
//     }

//     // 🔹 Step 2: Validate imagesSection
//     if (!event.imagesSection || typeof event.imagesSection !== "object") {
//       return res.status(404).json({ status: 404, message: "Image section not found in event" });
//     }

//     // 🔹 Step 3: Update `image_title` and `image_description`
//     if (image_title !== undefined) event.imagesSection.image_title = image_title;
//     if (image_description !== undefined) event.imagesSection.image_description = image_description;

//     // 🔹 Step 4: Update specific images (title & description)
//     if (updated_images) {
//       let updatedImagesArray = [];
//       try {
//         updatedImagesArray = JSON.parse(updated_images); // Expecting a JSON array
//       } catch (error) {
//         return res.status(400).json({ status: 400, message: "Invalid updated_images format. Must be an array." });
//       }

//       updatedImagesArray.forEach((update) => {
//         const img = event.imagesSection.images.find((img) => img._id.toString() === update._id);
//         if (img) {
//           if (update.title) img.title = update.title;
//           if (update.description) img.description = update.description;
//         }
//       });
//     }

//     // 🔹 Step 5: Remove images if requested
//     let removeImagesArray = [];
//     if (remove_images) {
//       try {
//         removeImagesArray = JSON.parse(remove_images);
//       } catch (error) {
//         return res.status(400).json({ status: 400, message: "Invalid remove_images format. Must be an array." });
//       }
//     }

//     if (removeImagesArray.length > 0) {
//       event.imagesSection.images = event.imagesSection.images.filter(
//         (img) => !removeImagesArray.includes(img._id.toString())
//       );
//     }

//     // 🔹 Step 6: Upload new images if provided
//     if (req.files?.images) {
//       const uploadedImages = await Promise.all(
//         req.files.images.map(async (file, index) => {
//           const title = req.body[`image${index + 1}_title`] || "";
//           const description = req.body[`image${index + 1}_description`] || "";
//           const imageUrl = await cloudinary.uploadImageToCloudinary(file.buffer);
//           return { url: imageUrl, title, description, _id: new mongoose.Types.ObjectId() };
//         })
//       );
//       event.imagesSection.images.push(...uploadedImages);
//     }

//     // 🔹 Step 7: Save the event
//     await event.save();
//     return res.status(200).json({
//       status: 200,
//       message: "Image section updated successfully",
//       imagesSection: event.imagesSection,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       status: 500,
//       message: "Error updating image section",
//       error: error.message,
//     });
//   }
// };

// const updateVideoSection = async (req, res) => {
//   try {
//     const { eventId } = req.params; // Get event ID from URL params
//     const { video_title, video_description } = req.body; // Get new values from request body

//     // Find and update the event
//     const updatedEvent = await Event.findByIdAndUpdate(
//       eventId,
//       {
//         $set: {
//           "videosSection.video_title": video_title,
//           "videosSection.video_description": video_description,
//         },
//       },
//       { new: true } // Return the updated document
//     );

//     if (!updatedEvent) {
//       return res.status(404).json({ status: 404, message: "Event not found" });
//     }

//     return res.status(200).json({
//       status: 200,
//       message: "Video section updated successfully!",
//       event: updatedEvent.videosSection,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       status: 500,
//       message: "Error updating video section",
//       error: error.message,
//     });
//   }
// };

// /*
// const updateVideoSection = async (req, res) => {
//   try {
//     const { videoSectionId } = req.params;
//     const { video_title, video_description, remove_videos } = req.body;

//     const event = await Event.findOne({ "videosSection._id": videoSectionId });
//     if (!event) {
//       return res.status(404).json({ status: 404, message: "Video section not found" });
//     }

//     if (video_title) event.videosSection.video_title = video_title;
//     if (video_description) event.videosSection.video_description = video_description;

//     let removeVideosArray = [];
//     if (remove_videos) {
//       try {
//         removeVideosArray = JSON.parse(remove_videos); 
//       } catch (error) {
//         return res.status(400).json({ status: 400, message: "Invalid remove_videos format. Must be an array." });
//       }
//     }

//     if (removeVideosArray.length > 0) {
//       event.videosSection.videos = event.videosSection.videos.filter(video => !removeVideosArray.includes(video));
//     }

//     if (req.files?.videos) {
//       const uploadedVideos = await Promise.all(
//         req.files.videos.map((file) => cloudinary.uploadVideoToCloudinary(file.buffer))
//       );
//       event.videosSection.videos.push(...uploadedVideos);
//     }

//     await event.save();
//     return res.status(200).json({ status: 200, message: "Video section updated successfully", videosSection: event.videosSection });
//   } catch (error) {
//     return res.status(500).json({ status: 500, message: "Error updating video section", error: error.message });
//   }
// };
// */
// module.exports = {
//   createOrUpdateEvent,
//   getEvents,
//   getEventById,
//   updateEvent,
//   deleteEvent,
//   updateImageSection,
//   updateVideoSection
// };









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
