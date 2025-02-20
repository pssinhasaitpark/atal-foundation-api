const Joi = require("joi");

const galleryValidation = Joi.object({
  title: Joi.string().trim().required().messages({
    "string.empty": "Title is required",
  }),
});

module.exports = { galleryValidation };
