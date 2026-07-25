const express = require('express');
const validate = require('../middlewares/validation.middleware');
const { signupValidator } = require('../validators/auth.validator');

const router = express.Router();

const authController = require('../controllers/auth.controller');

const asyncHandler = require('../utils/asyncHandler');

router.post('/signup', signupValidator, validate, asyncHandler(authController.signup));

module.exports = router;
