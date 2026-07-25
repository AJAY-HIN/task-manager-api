const { body } = require('express-validator');

const signupValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),

  body('email').trim().isEmail().withMessage('Invalid email'),

  body('password').isLength({ min: 8 }).withMessage('Password must contain at least 8 characters'),
];

module.exports = {
  signupValidator,
};
