const User = require('../models/user.model');

class UserRepository {
  async findByEmail(email) {
    return await User.findOne({
      where: {
        email,
      },
    });
  }

  async create(userData) {
    return await User.create(userData);
  }

  async findById(id) {
    return User.findByPk(id);
  }
}

module.exports = new UserRepository();
