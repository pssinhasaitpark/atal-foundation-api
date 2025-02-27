const Event = require("../../models/event");
const cloudinary = require("../../middlewares/cloudinary");
const eventValidator = require("../../validators/event");
const { handleResponse } = require("../../utils/helper");

const createOrUpdateEvent = async (req, res) => {
  try {
    const { image_title, image_description, video_title, video_description } = req.body;

    const banner = req.files?.banner
      ? await cloudinary.uploadImageToCloudinary(req.files.banner[0].buffer)
      : null;

    if (!banner) {
      return res.status(400).json({ status: 400, message: "Banner image is required" });
    }

    let imagesArray = [];
    if (req.files?.images) {
      for (let i = 0; i < req.files.images.length; i++) {
        const file = req.files.images[i];
        const title = req.body[`image${i + 1}_title`]; // Adjust based on naming convention
        const description = req.body[`image${i + 1}_description`];

        const imageUrl = await cloudinary.uploadImageToCloudinary(file.buffer);
        imagesArray.push({
          url: imageUrl,
          title: title,
          description: description,
        });
      }
    }

    let videoUrls = [];
    if (req.files?.videos) {
      const uploadVideoPromises = req.files.videos.map((file) =>
        cloudinary.uploadVideoToCloudinary(file.buffer)
      );
      videoUrls = await Promise.all(uploadVideoPromises);
    }

    const newEvent = new Event({
      banner,
      imagesSection: {
        image_title,
        image_description,
        images: imagesArray,
      },
      videosSection: {
        video_title,
        video_description,
        videos: videoUrls,
      },
    });

    await newEvent.save();

    return res.status(201).json({
      status: 201,
      message: "Event created successfully!",
      _id: newEvent._id,
      banner: newEvent.banner,
      event: {
        imagesSection: newEvent.imagesSection,
        videosSection: newEvent.videosSection,
        createdAt: newEvent.createdAt,
        updatedAt: newEvent.updatedAt,
        __v: newEvent.__v,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Error creating event",
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
  try {
    const { id } = req.params;
    const { 
      image_title, image_description, video_title, video_description, 
      remove_images, remove_videos, remove_banner 
    } = req.body;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ status: 404, message: "Event not found" });
    }

    if (remove_banner === "true" && event.banner) {
      const publicId = event.banner.split("/").pop().split(".")[0]; 
      await cloudinary.uploader.destroy(publicId); 
      event.banner = ""; 
    }

    if (req.files?.banner) {
      event.banner = await cloudinary.uploadImageToCloudinary(req.files.banner[0].buffer);
    }

    if (image_title) event.imagesSection.image_title = image_title;
    if (image_description) event.imagesSection.image_description = image_description;

    let removeImagesArray = [];
    if (remove_images) {
      try {
        removeImagesArray = JSON.parse(remove_images);
      } catch (error) {
        return res.status(400).json({ status: 400, message: "Invalid remove_images format. Must be an array." });
      }
      event.imagesSection.images = event.imagesSection.images.filter(img => !removeImagesArray.includes(img.url));
    }

    if (req.files?.images) {
      for (let i = 0; i < req.files.images.length; i++) {
        const file = req.files.images[i];
        const title = req.body[`image${i + 1}_title`];
        const description = req.body[`image${i + 1}_description`];

        const imageUrl = await cloudinary.uploadImageToCloudinary(file.buffer);
        event.imagesSection.images.push({
          url: imageUrl,
          title: title,
          description: description,
        });
      }
    }

    if (video_title) event.videosSection.video_title = video_title;
    if (video_description) event.videosSection.video_description = video_description;

    let removeVideosArray = [];
    if (remove_videos) {
      try {
        removeVideosArray = JSON.parse(remove_videos);
      } catch (error) {
        return res.status(400).json({ status: 400, message: "Invalid remove_videos format. Must be an array." });
      }
      event.videosSection.videos = event.videosSection.videos.filter(video => !removeVideosArray.includes(video));
    }

    if (req.files?.videos) {
      const uploadedVideos = await Promise.all(
        req.files.videos.map((file) => cloudinary.uploadVideoToCloudinary(file.buffer))
      );
      event.videosSection.videos.push(...uploadedVideos);
    }

    await event.save();
    return res.status(200).json({ status: 200, message: "Event updated successfully", event });

  } catch (error) {
    return res.status(500).json({ status: 500, message: "Error updating event", error: error.message });
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

const updateImageSection = async (req, res) => {
  try {
    const { imageSectionId } = req.params;
    const { image_title, image_description, remove_images } = req.body;

    const event = await Event.findOne({ "imagesSection._id": imageSectionId });
    if (!event) {
      return res.status(404).json({ status: 404, message: "Image section not found" });
    }

    if (image_title) event.imagesSection.image_title = image_title;
    if (image_description) event.imagesSection.image_description = image_description;

    let removeImagesArray = [];
    if (remove_images) {
      try {
        removeImagesArray = JSON.parse(remove_images); 
      } catch (error) {
        return res.status(400).json({ status: 400, message: "Invalid remove_images format. Must be an array." });
      }
    }

    if (removeImagesArray.length > 0) {
      event.imagesSection.images = event.imagesSection.images.filter(img => !removeImagesArray.includes(img.url));
    }

    if (req.files?.images) {
      const uploadedImages = await Promise.all(
        req.files.images.map((file) => {
          const title = req.body[`image${i + 1}_title`];
          const description = req.body[`image${i + 1}_description`];
          return cloudinary.uploadImageToCloudinary(file.buffer).then(imageUrl => ({
            url: imageUrl,
            title: title,
            description: description,
          }));
        })
      );
      event.imagesSection.images.push(...uploadedImages);
    }

    await event.save();
    return res.status(200).json({ status: 200, message: "Image section updated successfully", imagesSection: event.imagesSection });
  } catch (error) {
    return res.status(500).json({ status: 500, message: "Error updating image section", error: error.message });
  }
};

const updateVideoSection = async (req, res) => {
  try {
    const { videoSectionId } = req.params;
    const { video_title, video_description, remove_videos } = req.body;

    const event = await Event.findOne({ "videosSection._id": videoSectionId });
    if (!event) {
      return res.status(404).json({ status: 404, message: "Video section not found" });
    }

    if (video_title) event.videosSection.video_title = video_title;
    if (video_description) event.videosSection.video_description = video_description;

    let removeVideosArray = [];
    if (remove_videos) {
      try {
        removeVideosArray = JSON.parse(remove_videos); 
      } catch (error) {
        return res.status(400).json({ status: 400, message: "Invalid remove_videos format. Must be an array." });
      }
    }

    if (removeVideosArray.length > 0) {
      event.videosSection.videos = event.videosSection.videos.filter(video => !removeVideosArray.includes(video));
    }

    if (req.files?.videos) {
      const uploadedVideos = await Promise.all(
        req.files.videos.map((file) => cloudinary.uploadVideoToCloudinary(file.buffer))
      );
      event.videosSection.videos.push(...uploadedVideos);
    }

    await event.save();
    return res.status(200).json({ status: 200, message: "Video section updated successfully", videosSection: event.videosSection });
  } catch (error) {
    return res.status(500).json({ status: 500, message: "Error updating video section", error: error.message });
  }
};

module.exports = {
  createOrUpdateEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  updateImageSection,
  updateVideoSection
};
