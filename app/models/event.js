const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  images:[String],
  videos: [String],
}, 
{ timestamps: true });

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;

