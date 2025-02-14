
const Joi = require('joi');

const userRegistrationSchema = Joi.object({
  user_name: Joi.string().required(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string().email().required(),
  mobile: Joi.string().required(),
  password: Joi.string().min(6).required(),
});

const userRegistrationFormSchema = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string().email().required(),
  mobile: Joi.string().required(),
  address: Joi.string().required(),
  gender: Joi.string().valid('male', 'female', 'other').required(),
  date_of_birth: Joi.date().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  category: Joi.string().required(),
  designation: Joi.string().required(),
  message: Joi.string().optional(),
  photo: Joi.string().optional(),
});

const userLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

module.exports = { userRegistrationSchema, userRegistrationFormSchema, userLoginSchema };
