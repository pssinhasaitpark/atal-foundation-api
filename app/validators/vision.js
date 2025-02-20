const { body } = require("express-validator");

const visionValidator = [
  body("heading").not().isEmpty().withMessage("Heading is required"),
  body("text").not().isEmpty().withMessage("Text is required"),
];

module.exports = visionValidator;
