const userRepository = require("../repositories/user.repository");

class UserService {
    async getUsers() {
        const users = await userRepository.findAll();

        return users;
    }
}

module.exports = new UserService();