const mongoose = require('mongoose');

const audioQuoteSchema = new mongoose.Schema({
  filePath: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const AudioQuote = mongoose.model('AudioQuote', audioQuoteSchema);

module.exports = AudioQuote;



