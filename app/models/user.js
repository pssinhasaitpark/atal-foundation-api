const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  user_role: {
    type: String,
    enum: ['user', 'super_admin', 'admin'],
  },
  user_name: {
    type: String,
    unique: true,
    trim: true,
  },
  first_name: {
    type: String,
    required: true,
    trim: true,
  },
  last_name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
  },
  mobile: {
    type: String,
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
  password: {
    type: String,
  },
}, {
  timestamps: true,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
