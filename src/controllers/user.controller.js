const userService = require('../services/user.service');

class UserController {
  async getUsers(req, res) {
    const users = await userService.getUsers();

    res.status(200).json({
      success: true,
      message: 'Users fetched successfully',
      data: users,
    });
  }

  async getMe(req, res) {
    const { id, name, email, role, createdAt, updatedAt } = req.user;

    res.status(200).json({
      success: true,
      message: 'Current user profile fetched successfully',
      data: { id, name, email, role, createdAt, updatedAt },
    });
  }

  async findById(req, res) {
    const { id } = req.params;
    const user = await userService.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const { name, email, role, createdAt, updatedAt } = user;
    res.status(200).json({
      success: true,
      message: 'User fetched successfully',
      data: { id: user.id, name, email, role, createdAt, updatedAt },
    });
  }
}

module.exports = new UserController();
