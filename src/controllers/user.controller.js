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
}

module.exports = new UserController();
