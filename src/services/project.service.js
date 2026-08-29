const projectRepository = require('../repositories/project.repository');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

class ProjectService {
  async createProject(projectData, userId) {
    return await projectRepository.create({
      ...projectData,
      userId,
    });
  }

  async getProjectById(id, currentUser) {
    const project = await projectRepository.findById(id);
    if (!project) {
      throw new NotFoundError(`Project with ID ${id} not found`);
    }

    // Check authorization: Owner or Admin
    if (project.userId !== currentUser.id && currentUser.role !== 'ADMIN') {
      throw new ForbiddenError('You do not have permission to access this project');
    }

    return project;
  }

  async getAllProjects(currentUser) {
    // Admins can see all projects; normal users only see their own
    const whereClause = currentUser.role === 'ADMIN' ? {} : { userId: currentUser.id };
    return await projectRepository.findAll(whereClause);
  }

  async updateProject(id, updateData, currentUser) {
    const project = await projectRepository.findById(id);
    if (!project) {
      throw new NotFoundError(`Project with ID ${id} not found`);
    }

    if (project.userId !== currentUser.id && currentUser.role !== 'ADMIN') {
      throw new ForbiddenError('You do not have permission to update this project');
    }

    return await projectRepository.update(id, updateData);
  }

  async deleteProject(id, currentUser) {
    const project = await projectRepository.findById(id);
    if (!project) {
      throw new NotFoundError(`Project with ID ${id} not found`);
    }

    if (project.userId !== currentUser.id && currentUser.role !== 'ADMIN') {
      throw new ForbiddenError('You do not have permission to delete this project');
    }

    return await projectRepository.delete(id);
  }
}

module.exports = new ProjectService();
