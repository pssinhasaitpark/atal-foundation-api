const Joi = require("joi");

const contactSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  contact_no: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .message("Contact number must be a 10-digit number")
    .required(),
  enquiry: Joi.string().min(10).max(500).required(),
});

module.exports = { contactSchema };
