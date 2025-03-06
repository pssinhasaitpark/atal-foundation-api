const mongoose = require("mongoose");

const socialMediaSchema = new mongoose.Schema(
  {
    whatsapp: { link: String },
    facebook: { link: String },
    instagram: { link: String },
    youtube: { link: String },
    linkedIn: { link: String },
    snapchat: { link: String },
    thread: { link: String },
    pinterest: { link: String },
    x: { link: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("SocialMedia", socialMediaSchema);
