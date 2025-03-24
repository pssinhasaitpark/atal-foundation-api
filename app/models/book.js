
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  book_title: { type: String, required: true },
  description: { type: String, required: true },
  cover_image: { type: String},
  images:[String]

}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);

  // heading: {
  //   type: String,
  //   required: true
  // },
  // banner: {
  //   type: String,  
  //   required: true
  // },
  // description: {
  //   type: String,
  //   required: true
  // },
  // book_images: [
  //   {
  //     url: {
  //       type: String, 
  //       required: true
  //     },
  //     _id: {
  //       type: String, 
  //       required: true
  //     }
  //   }
  // ],
