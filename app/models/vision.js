const mongoose = require("mongoose");

const visionSchema = new mongoose.Schema({
  heading: {
    type: String,
    required: true,
    maxlength: 100,
  },
  text: {
    type: String,
    required: true,
    maxlength: 2000,
  },
  image: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Vision = mongoose.model("Vision", visionSchema);

module.exports = Vision;
