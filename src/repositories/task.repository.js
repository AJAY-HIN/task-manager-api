const { Task, Project, User } = require('../models');

class TaskRepository {
  async create(data) {
    return await Task.create(data);
  }

  async findById(id) {
    return await Task.findByPk(id, {
      include: [
        { model: Project, as: 'project' },
        { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] },
      ],
    });
  }

  async findByProjectId(projectId) {
    return await Task.findAll({
      where: { projectId },
      include: [{ model: User, as: 'assignee', attributes: ['id', 'name', 'email'] }],
    });
  }

  async update(id, data) {
    const task = await Task.findByPk(id);
    if (!task) return null;
    return await task.update(data);
  }

  async delete(id) {
    const task = await Task.findByPk(id);
    if (!task) return false;
    await task.destroy();
    return true;
  }
}

module.exports = new TaskRepository();
