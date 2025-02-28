

const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    banner: { type: String }, 

    imagesSection: {
      image_title: { type: String, trim: true }, 
      image_description: { type: String, trim: true }, 
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
      // videos: [{ type: String }] // Video URLs
      videos: [
        {
          _id: mongoose.Schema.Types.ObjectId,
          url: String    
        },
      ],
    }
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;
