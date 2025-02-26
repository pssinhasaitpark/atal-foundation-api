const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema({
  images: [{ type: String }], 
  title: { type: String, required: true },
  description: { type: String, required: true },
});

const ourProgrammesSchema = new mongoose.Schema(
  {
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    banner: { type: String },
    sections: [sectionSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("OurProgramme", ourProgrammesSchema);
