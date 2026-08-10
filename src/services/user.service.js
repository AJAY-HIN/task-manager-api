const userRepository = require('../repositories/user.repository');

class UserService {
  async getUsers() {
    const users = await userRepository.findAll();

    return users;
  }

  async findById(id) {
    return await userRepository.findById(id);
  }
}

module.exports = new UserService();
