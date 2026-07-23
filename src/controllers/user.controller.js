const userService = require("../services/user.service");

class UserController {
    async getUsers(req, res) {
        const users = await userService.getUsers();

        res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            data: users
        });
    }
}

module.exports = new UserController();