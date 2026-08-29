const taskService = require('../services/task.service');

class TaskController {
  async createTask(req, res) {
    const { projectId } = req.params;
    const task = await taskService.createTask(projectId, req.body, req.user);
    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task,
    });
  }

  async getTaskById(req, res) {
    const { id } = req.params;
    const task = await taskService.getTaskById(id, req.user);
    res.status(200).json({
      success: true,
      message: 'Task fetched successfully',
      data: task,
    });
  }

  async getTasksByProjectId(req, res) {
    const { projectId } = req.params;
    const tasks = await taskService.getTasksByProjectId(projectId, req.user);
    res.status(200).json({
      success: true,
      message: 'Tasks fetched successfully',
      data: tasks,
    });
  }

  async updateTask(req, res) {
    const { id } = req.params;
    const task = await taskService.updateTask(id, req.body, req.user);
    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task,
    });
  }

  async deleteTask(req, res) {
    const { id } = req.params;
    await taskService.deleteTask(id, req.user);
    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  }
}

module.exports = new TaskController();
