const authService = require('../services/auth.service');
const ValidationError = require('../errors/validationError');

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

  async refreshToken(req, res) {
    const { refreshToken } = req.body || {};

    if (!refreshToken) {
      throw new ValidationError('Refresh token is required');
    }

    const data = await authService.refreshToken(refreshToken);

    return res.status(200).json({
      success: true,

      message: 'Access token refreshed',

      data,
    });
  }
}

module.exports = new AuthController();
