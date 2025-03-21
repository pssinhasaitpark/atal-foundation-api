const Joi = require("joi");

const supportSpeakerValidation = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Name is required.",
  }),
  post: Joi.string().required().messages({
    "string.empty": "Post is required.",
  }),
  location: Joi.string().required().messages({
    "string.empty": "Location is required.",
  }),
});

module.exports = { supportSpeakerValidation };
