// const mongoose = require('mongoose');

// const userFormSchema = new mongoose.Schema({
//   user_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//   },
//   first_name: String,
//   last_name: String,
//   email: String,
//   mobile: String,
//   address: {
//     type: String,
//   },
//   gender: {
//     type: String,
//     enum: ['male', 'female', 'other'],
//   },
//   date_of_birth: {
//     type: Date,
//   },
//   city: {
//     type: String,
//   },
//   state: {
//     type: String,
//   },
//   category: {
//     type: String,
//   },
//   designation: {
//     type: String,
//   },
//   message: {
//     type: String,
//   },
//   images: [String]
// }, {
//   timestamps: true,
// });

// const UserForm = mongoose.model('RegistrationForm', userFormSchema); 

// module.exports = UserForm; 




const mongoose = require("mongoose");

const userFormSchema = new mongoose.Schema({
  registrations: [
    {
      first_name: String,
      last_name: String,
      email: String,
      mobile: String,
      address: String,
      gender: String,
      date_of_birth: Date,
      city: String,
      state: String,
      category: String,
      designation: String,
      message: String,
      images: [String],
      user_role: {
        type: String,
        default: "user",
      },
      user_id: mongoose.Schema.Types.ObjectId,
    },
  ],
});

const UserForm = mongoose.model("RegistrationForm", userFormSchema);
module.exports = UserForm;