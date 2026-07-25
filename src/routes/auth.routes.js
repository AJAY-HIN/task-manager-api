const express = require('express');
const validate = require('../middlewares/validation.middleware');
const { signupValidator } = require('../validators/auth.validator');

const router = express.Router();

const authController = require('../controllers/auth.controller');
const validationMiddleware = require('../middlewares/validation.middleware');
const asyncHandler = require('../utils/asyncHandler');

router.post('/signup', signupValidator, validationMiddleware, asyncHandler(authController.signup));

module.exports = router;
