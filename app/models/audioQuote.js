const mongoose = require('mongoose');

const audioQuoteSchema = new mongoose.Schema({
  heading: { type: String, required: true },
  description: { type: String, required: true },

  audio_section: [
    {
      title: {
        type: String
      },
      images: {
        type: String
      },
      audio: {
        type: String
      }
    }
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const AudioQuote = mongoose.model('AudioQuote', audioQuoteSchema);

module.exports = AudioQuote;



