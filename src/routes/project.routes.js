const express = require('express');
const projectController = require('../controllers/project.controller');
const taskController = require('../controllers/task.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

// All project routes require authentication
router.use(authMiddleware);

router.route('/')
  .get(asyncHandler(projectController.getAllProjects))
  .post(asyncHandler(projectController.createProject));

router.route('/:id')
  .get(asyncHandler(projectController.getProjectById))
  .put(asyncHandler(projectController.updateProject))
  .delete(asyncHandler(projectController.deleteProject));

// Task management inside a project
router.route('/:projectId/tasks')
  .get(asyncHandler(taskController.getTasksByProjectId))
  .post(asyncHandler(taskController.createTask));

module.exports = router;
