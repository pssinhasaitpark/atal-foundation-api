const mongoose = require("mongoose");

const homeSchema = new mongoose.Schema({
  text: {type: String,required: true},
  images: [ { type: String, required: true, },],
  link: { type: String, required: true,},
  createdAt: {type: Date, default: Date.now, },
});

const Home = mongoose.model("Home", homeSchema);

module.exports = Home;
