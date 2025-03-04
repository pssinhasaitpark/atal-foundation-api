const mongoose = require('mongoose');

const homePageSchema = new mongoose.Schema({
    badge: { type: String },
    title: { type: String },
    description: { type: String },
    image1: [
        {
            _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
            url: { type: String, required: true }
        }
    ],
    image2: [
        {
            _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
            url: { type: String, required: true }
        }
    ]
});

module.exports = mongoose.model('HomePage', homePageSchema);
