const { Project, Task, User } = require('../models');

class ProjectRepository {
  async create(data) {
    return await Project.create(data);
  }

  async findById(id) {
    return await Project.findByPk(id, {
      include: [
        { model: Task, as: 'tasks' },
        { model: User, as: 'owner', attributes: ['id', 'name', 'email'] },
      ],
    });
  }

  async findAll(whereClause = {}) {
    return await Project.findAll({
      where: whereClause,
      include: [
        { model: Task, as: 'tasks' },
        { model: User, as: 'owner', attributes: ['id', 'name', 'email'] },
      ],
    });
  }

  async update(id, data) {
    const project = await Project.findByPk(id);
    if (!project) return null;
    return await project.update(data);
  }

  async delete(id) {
    const project = await Project.findByPk(id);
    if (!project) return false;
    await project.destroy();
    return true;
  }
}

module.exports = new ProjectRepository();
