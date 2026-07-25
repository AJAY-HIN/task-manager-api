const { body } = require('express-validator');

const signupValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 3 })
    .withMessage('Name must contain at least 3 characters'),

  body('email').trim().isEmail().withMessage('Invalid email address').normalizeEmail(),

  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must contain at least 8 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain one lowercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain one number')
    .matches(/[!@#$%^&*]/)
    .withMessage('Password must contain one special character'),
];

module.exports = {
  signupValidator,
};
