const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  video_title: {
    type: String,
    
  },
  video_description: {
    type: String,
  },
  videos: [{
    type: String, 
  }],
}, { timestamps: true });

const EventVideo = mongoose.model('EventVideo', videoSchema);

module.exports = EventVideo;
