const { body } = require("express-validator");

const visionValidator = [
  body("heading").not().isEmpty().withMessage("Heading is required"),
  body("text").not().isEmpty().withMessage("Text is required"),
  body("image").custom((value, { req }) => {
    if (!req.file) {
      throw new Error("Image is required");
    }
    return true;
  }),
];

module.exports = visionValidator;
