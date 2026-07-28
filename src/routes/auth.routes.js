const express = require('express');
const { signupValidator, loginValidator } = require('../validators/auth.validator');

const router = express.Router();

const authController = require('../controllers/auth.controller');
const validationMiddleware = require('../middlewares/validation.middleware');
const asyncHandler = require('../utils/asyncHandler');

router.post('/signup', signupValidator, validationMiddleware, asyncHandler(authController.signup));
router.post('/login', loginValidator, validationMiddleware, asyncHandler(authController.login));
router.post('/refresh-token', asyncHandler(authController.refreshToken));
module.exports = router;
