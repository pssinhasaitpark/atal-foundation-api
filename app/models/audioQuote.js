const mongoose = require('mongoose');

const audioQuoteSchema = new mongoose.Schema({
  heading: { type: String, required: true },
  description: { type: String, required: true },

  audio_section: [
    {
      title: {
        type: String, 
        required: true
      },
      images: {
        type: String, 
        required: true
      },
      audio: {
        type: String, 
        required: true
      }
    }
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const AudioQuote = mongoose.model('AudioQuote', audioQuoteSchema);

module.exports = AudioQuote;



