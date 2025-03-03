const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema(
    {
        images: { type: [String]},
        headline: { type: String },
        description: {type: String },
    },
    { timestamps: true }
);

const News = mongoose.model('News', newsSchema);

module.exports = News;
