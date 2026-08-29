const express = require('express');

const router = express.Router();
const userRoutes = require('./user.routes');
const authRoutes = require('./auth.routes');
const projectRoutes = require('./project.routes');
const taskRoutes = require('./task.routes');

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Task Manager API is running',
    requestTime: req.requestTime,
  });
});

router.use('/api/v1/users', userRoutes);
router.use('/api/v1/auth', authRoutes);
router.use('/api/v1/projects', projectRoutes);
router.use('/api/v1/tasks', taskRoutes);

module.exports = router;
