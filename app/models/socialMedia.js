const mongoose = require("mongoose");

const socialMediaSchema = new mongoose.Schema(
  {
    whatsapp: { icon: String, link: String },
    facebook: { icon: String, link: String },
    instagram: { icon: String, link: String },
    youtube: { icon: String, link: String },
    linkedIn: { icon: String, link: String },
    snapchat: { icon: String, link: String },
    thread: { icon: String, link: String },
    pinterest: { icon: String, link: String },
    x: { icon: String, link: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("SocialMedia", socialMediaSchema);
