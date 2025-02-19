const mongoose = require("mongoose");

const visionSchema = new mongoose.Schema({
  heading: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
     image:
     [String],
     
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Vision = mongoose.model("Vision", visionSchema);

module.exports = Vision;
