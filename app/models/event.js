
const mongoose = require("mongoose");

const ImageGroupSchema = new mongoose.Schema({
    image_title: { type: String },
    image_description: { type: String},
    images: [{ type: String }] 
});

const EventSchema = new mongoose.Schema({
    banner: { type: String }, 
    title: { type: String }, 
    description: { type: String }, 
    imageGroups: [ImageGroupSchema] 
}, { timestamps: true });

module.exports = mongoose.model("Event", EventSchema);
