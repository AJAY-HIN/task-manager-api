const express = require('express');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/authorize.middleware');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

// Get current user profile (requires authentication)
router.get('/me', authMiddleware, asyncHandler(userController.getMe));

// List all users (admin only)
router.get('/', authMiddleware, authorize('ADMIN'), asyncHandler(userController.getUsers));

module.exports = router;
