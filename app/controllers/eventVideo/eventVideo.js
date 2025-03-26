const EventVideo = require('../../models/eventVideo');
const { uploadVideoToCloudinary } = require("../../middlewares/cloudinary");
const { handleResponse } = require("../../utils/helper"); 

exports.createEventVideo = async (req, res) => {
  try {
    const { video_title, video_description } = req.body;

    if (!req.files || !req.files.videos) {
      return handleResponse(res, 400, 'No videos uploaded');
    }

    // const videoFiles = Array.isArray(req.files.videos) ? req.files.videos : [req.files.videos];

    let videoUrls = [];
    if (req.convertedFiles.videos) {
      videoUrls = [...videoUrls, ...req.convertedFiles.videos];
    }

    // const videoUrls = [];

    // for (const file of videoFiles) {
    //   if (!file.buffer) {
    //     return handleResponse(res, 400, 'File buffer is missing');
    //   }

    //   const videoUrl = await uploadVideoToCloudinary(file.buffer); 
    //   videoUrls.push(videoUrl);
    // }

    
    const newEventVideo = new EventVideo({
      video_title,
      video_description,
      videos: videoUrls, 
    });

    await newEventVideo.save();

    return handleResponse(res, 201, 'Event video created successfully', { newEventVideo });
  } catch (error) {
    console.error(error);  
    return handleResponse(res, 500, error.message);
  }
};

exports.getAllEventVideo = async (req, res) => {
  try {
    const eventVideos = await EventVideo.find();

    if (!eventVideos || eventVideos.length === 0) {
      return handleResponse(res, 404, 'No event videos found');
    }

    return handleResponse(res, 200, 'Event videos retrieved successfully', { eventVideos });
  } catch (error) {
    console.error(error);
    return handleResponse(res, 500, error.message);
  }
};

exports.getEventVideoById = async (req, res) => {
  try {
    const eventVideoId = req.params.id;

    const eventVideo = await EventVideo.findById(eventVideoId);

    if (!eventVideo) {
      return handleResponse(res, 404, 'Event video not found');
    }

    return handleResponse(res, 200, 'Event video retrieved successfully', { eventVideo });
  } catch (error) {
    console.error(error);
    return handleResponse(res, 500, error.message);
  }
};
/*
exports.updateEventVideo = async (req, res) => {
  try {

    let { video_title, video_description, remove_videos } = req.body;
    const eventVideoId = req.params.id; 

    if (typeof remove_videos === 'string') {
      try {
        remove_videos = JSON.parse(remove_videos);
      } catch (error) {
        return handleResponse(res, 400, 'Invalid JSON format for remove_videos');
      }
    }

    const eventVideo = await EventVideo.findById(eventVideoId);
    if (!eventVideo) {
      return handleResponse(res, 404, 'Event video not found');
    }

    if (video_title) eventVideo.video_title = video_title;
    if (video_description) eventVideo.video_description = video_description;

    if (req.files && req.files.videos) {
      const videoFiles = Array.isArray(req.files.videos) ? req.files.videos : [req.files.videos];
      const videoUrls = [];

      for (const file of videoFiles) {
        const videoUrl = await uploadVideoToCloudinary(file.buffer); 
        videoUrls.push(videoUrl);
      }

      eventVideo.videos = [...eventVideo.videos, ...videoUrls];
    }


    if (remove_videos && Array.isArray(remove_videos)) {

      eventVideo.videos = eventVideo.videos.filter(video => !remove_videos.includes(video));

    }

    await eventVideo.save();

    return handleResponse(res, 200, 'Event video updated successfully', { eventVideo });
  } catch (error) {
    console.error(error);
    return handleResponse(res, 500, error.message);
  }
};
*/

exports.updateEventVideo = async (req, res) => {
  try {
    let { video_title, video_description, remove_videos } = req.body;
    const eventVideoId = req.params.id;

    // 🟡 Parse `remove_videos` if it's a string
    if (typeof remove_videos === "string") {
      try {
        remove_videos = JSON.parse(remove_videos);
      } catch (error) {
        return handleResponse(res, 400, "Invalid JSON format for remove_videos");
      }
    }

    // 🔎 Find event video
    const eventVideo = await EventVideo.findById(eventVideoId);
    if (!eventVideo) {
      return handleResponse(res, 404, "Event video not found");
    }

    let updatedData = {};

    // 🔹 Update title and description
    if (video_title) updatedData.video_title = video_title;
    if (video_description) updatedData.video_description = video_description;

    // 🔥 Remove selected videos if any
    if (remove_videos && Array.isArray(remove_videos)) {
      updatedData.videos = eventVideo.videos.filter((video) => !remove_videos.includes(video));
    } else {
      updatedData.videos = eventVideo.videos;
    }

    // 🎥 Upload and add new videos
    if (req.convertedFiles && req.convertedFiles.videos) {
      const newVideos = req.convertedFiles.videos;
      updatedData.videos = [...updatedData.videos, ...newVideos];
    }

    // 🚀 Update using findByIdAndUpdate
    const updatedEventVideo = await EventVideo.findByIdAndUpdate(
      eventVideoId,
      { $set: updatedData },
      { new: true, runValidators: true }
    );

    if (!updatedEventVideo) {
      return handleResponse(res, 404, "Failed to update event video");
    }

    console.log("Event video successfully updated:", updatedEventVideo);
    return handleResponse(res, 200, "Event video updated successfully", { eventVideo: updatedEventVideo });
  } catch (error) {
    console.error("Error updating event video:", error.message);
    return handleResponse(res, 500, "Error updating event video", { error: error.message });
  }
};


exports.deleteEventVideo = async (req, res) => {
  try {
    const eventVideoId = req.params.id; 

    const eventVideo = await EventVideo.findByIdAndDelete(eventVideoId);

    if (!eventVideo) {
      return handleResponse(res, 404, 'Event video not found');
    }

    return handleResponse(res, 200, 'Event video deleted successfully');
  } catch (error) {
    console.error(error);
    return handleResponse(res, 500, error.message);
  }
};



