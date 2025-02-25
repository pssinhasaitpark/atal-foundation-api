// const Joi = require("joi");

// const galleryValidation = Joi.object({
//   title: Joi.string().trim().required().messages({
//     "string.empty": "Title is required",
//   }),
// });

// module.exports = { galleryValidation };

const Joi = require("joi");

const galleryValidation = Joi.object({
  gallery_image_title: Joi.string().trim().required().messages({
    "string.empty": "Gallery image title is required",
    "any.required": "Gallery image title is required"
  }),
  gallery_image_description: Joi.string().trim().optional(),

  gallery_video_title: Joi.string().trim().required().messages({
    "string.empty": "Gallery video title is required",
    "any.required": "Gallery video title is required"
  }),
  gallery_video_description: Joi.string().trim().optional(),

  images: Joi.array().items(Joi.string().uri()).optional(),
  videos: Joi.array().items(Joi.string().uri()).optional()
});

module.exports = { galleryValidation };

