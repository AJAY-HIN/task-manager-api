const authService = require('../services/auth.service');

class AuthController {
  async signup(req, res) {
    const user = await authService.signup(req.body);

    res.status(201).json({
      success: true,

      message: 'User registered successfully',

      data: user,
    });
  }
}

module.exports = new AuthController();
