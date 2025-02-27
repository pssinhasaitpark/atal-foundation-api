

const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    banner: { type: String }, // Banner image URL

    imagesSection: {
      image_title: { type: String, trim: true }, // Common title for images
      image_description: { type: String, trim: true }, // Common description for images
      // videos: [{ url: {type: String }} ],
      images: [
        {
          url: { type: String }, // Image URL
          title: { type: String, trim: true }, // Individual Image Title
          description: { type: String, trim: true }, // Individual Image Description
        },
        
      ],      
    },

    videosSection: {
      video_title: { type: String, trim: true }, // Common Video Title
      video_description: { type: String, trim: true }, // Common Video Description
      videos: [{ type: String }] // Video URLs
    }
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;
