const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema({
  image: { type: String }, 
  title: { type: String },
  description: { type: String },
});

const aboutSchema = new mongoose.Schema(
  {
    banner: { type: String }, 
    sections: [sectionSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("About", aboutSchema);
