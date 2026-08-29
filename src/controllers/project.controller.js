const projectService = require('../services/project.service');

class ProjectController {
  async createProject(req, res) {
    const project = await projectService.createProject(req.body, req.user.id);
    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project,
    });
  }

  async getProjectById(req, res) {
    const { id } = req.params;
    const project = await projectService.getProjectById(id, req.user);
    res.status(200).json({
      success: true,
      message: 'Project fetched successfully',
      data: project,
    });
  }

  async getAllProjects(req, res) {
    const projects = await projectService.getAllProjects(req.user);
    res.status(200).json({
      success: true,
      message: 'Projects fetched successfully',
      data: projects,
    });
  }

  async updateProject(req, res) {
    const { id } = req.params;
    const project = await projectService.updateProject(id, req.body, req.user);
    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: project,
    });
  }

  async deleteProject(req, res) {
    const { id } = req.params;
    await projectService.deleteProject(id, req.user);
    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
    });
  }
}

module.exports = new ProjectController();
