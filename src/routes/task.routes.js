const express = require('express');
const taskController = require('../controllers/task.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

// All task routes require authentication
router.use(authMiddleware);

router.route('/:id')
  .get(asyncHandler(taskController.getTaskById))
  .put(asyncHandler(taskController.updateTask))
  .delete(asyncHandler(taskController.deleteTask));

module.exports = router;
