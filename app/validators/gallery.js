const Joi = require("joi");

const galleryValidation = Joi.object({
  gallery_image_title: Joi.string().trim(),
  gallery_image_description: Joi.string().trim().optional(),

  gallery_video_title: Joi.string().trim(),
  gallery_video_description: Joi.string().trim().optional(),

  images: Joi.array().items(Joi.string().uri()).optional(),
  videos: Joi.array().items(Joi.string().uri()).optional()
});

module.exports = { galleryValidation };

 