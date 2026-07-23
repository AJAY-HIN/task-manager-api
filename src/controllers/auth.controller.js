const authService = require("../services/auth.service");

class AuthController {

    async signup(req, res, next) {

        try {

            const user =
                await authService.signup(req.body);

            return res.status(201).json({
                success: true,
                message: "User registered successfully",
                data: user
            });

        } catch (error) {
            next(error);
        }

    }

}

module.exports = new AuthController();