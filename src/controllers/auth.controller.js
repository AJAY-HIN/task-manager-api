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

  async login(req, res) {
    const result = await authService.login(req.body);

    return res.status(200).json({
      success: true,

      message: 'Login successful',

      data: result,
    });
  }
}

module.exports = new AuthController();
