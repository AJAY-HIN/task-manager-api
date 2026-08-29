const taskRepository = require('../repositories/task.repository');
const projectRepository = require('../repositories/project.repository');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

class TaskService {
  async createTask(projectId, taskData, currentUser) {
    const project = await projectRepository.findById(projectId);
    if (!project) {
      throw new NotFoundError(`Project with ID ${projectId} not found`);
    }

    if (project.userId !== currentUser.id && currentUser.role !== 'ADMIN') {
      throw new ForbiddenError('You do not have permission to add tasks to this project');
    }

    return await taskRepository.create({
      ...taskData,
      projectId,
    });
  }

  async getTaskById(id, currentUser) {
    const task = await taskRepository.findById(id);
    if (!task) {
      throw new NotFoundError(`Task with ID ${id} not found`);
    }

    const project = task.project;
    if (!project) {
      throw new NotFoundError('Associated project not found');
    }

    if (project.userId !== currentUser.id && currentUser.role !== 'ADMIN') {
      throw new ForbiddenError('You do not have permission to view this task');
    }

    return task;
  }

  async getTasksByProjectId(projectId, currentUser) {
    const project = await projectRepository.findById(projectId);
    if (!project) {
      throw new NotFoundError(`Project with ID ${projectId} not found`);
    }

    if (project.userId !== currentUser.id && currentUser.role !== 'ADMIN') {
      throw new ForbiddenError('You do not have permission to view tasks for this project');
    }

    return await taskRepository.findByProjectId(projectId);
  }

  async updateTask(id, updateData, currentUser) {
    const task = await taskRepository.findById(id);
    if (!task) {
      throw new NotFoundError(`Task with ID ${id} not found`);
    }

    const project = task.project;
    if (project.userId !== currentUser.id && currentUser.role !== 'ADMIN') {
      throw new ForbiddenError('You do not have permission to update this task');
    }

    return await taskRepository.update(id, updateData);
  }

  async deleteTask(id, currentUser) {
    const task = await taskRepository.findById(id);
    if (!task) {
      throw new NotFoundError(`Task with ID ${id} not found`);
    }

    const project = task.project;
    if (project.userId !== currentUser.id && currentUser.role !== 'ADMIN') {
      throw new ForbiddenError('You do not have permission to delete this task');
    }

    return await taskRepository.delete(id);
  }
}

module.exports = new TaskService();
