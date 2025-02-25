// const mongoose = require("mongoose");

// const gallerySchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     images: {
//       type: [String]
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Gallery", gallerySchema);

const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true }, // ✅ Auto-generate _id
  title: { type: String, trim: true },
  description: { type: String, trim: true },
  images: [String],
});

const videoSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true }, // ✅ Auto-generate _id
  title: { type: String, trim: true },
  description: { type: String, trim: true },
  videos: [String],
});

const gallerySchema = new mongoose.Schema(
  {
    gallery_image: { type: imageSchema, required: true },
    gallery_video: { type: videoSchema, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Gallery", gallerySchema);
