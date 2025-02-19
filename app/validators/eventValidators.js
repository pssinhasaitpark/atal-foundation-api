const Joi = require("joi");

const eventValidator = Joi.object({
  title: Joi.string().required(),
  location: Joi.string().required(),
  description: Joi.string().required(),
  images: Joi.array().items(Joi.string().uri()), // optional array of image URLs
});

module.exports = eventValidator;
