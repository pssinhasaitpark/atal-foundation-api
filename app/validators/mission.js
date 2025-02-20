const Joi = require("joi");

const missionValidator = Joi.object({
  heading: Joi.string().required(),
  text: Joi.string().required(),
  images: Joi.string().optional(), // Optional field
});

module.exports = missionValidator;
