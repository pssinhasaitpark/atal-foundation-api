const { body } = require('express-validator');

const homeValidator = [
  body('text').notEmpty().withMessage('Text is required').isLength({ max: 2000 }).withMessage('Text should not exceed 2000 characters'),
  body('link').notEmpty().withMessage('Link is required').isURL().withMessage('Link should be a valid URL'),
];

module.exports = homeValidator;

