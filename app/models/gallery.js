const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    images: {
      type: [String]
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Gallery", gallerySchema);
