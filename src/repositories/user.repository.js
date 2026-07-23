const users = require("../data/users");

class UserRepository {
    async findAll() {
        return users;
    }
}

module.exports = new UserRepository();