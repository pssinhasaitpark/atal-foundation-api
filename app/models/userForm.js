const mongoose = require('mongoose');

const userFormSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  address: {
    type: String,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
  },
  date_of_birth: {
    type: Date,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  category: {
    type: String,
  },
  designation: {
    type: String,
  },
  message: {
    type: String,
  },
  photo: {
    type: String,
  },
}, {
  timestamps: true,
});

const UserForm = mongoose.model('RegistrationForm', userFormSchema); 

module.exports = UserForm; 
