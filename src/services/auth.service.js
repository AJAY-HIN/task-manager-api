const bcrypt = require('bcrypt');

const userRepository = require('../repositories/user.repository');
const ConflictError = require('../errors/ConflictError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt');
const { hashToken } = require('../utils/token');
const refreshTokenRepository = require('../repositories/refresh-token.repository');
const jwt = require('jsonwebtoken');
const config = require('../config/env');

class AuthService {
  async signup(userData) {
    const existingUser = await userRepository.findByEmail(userData.email);

    if (existingUser) {
      throw new ConflictError('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser = await userRepository.create({
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
    });

    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    };
  }

  async login(credentials) {
    const user = await userRepository.findByEmail(credentials.email);

    if (!user) {
      throw new UnauthorizedError();
    }

    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);

    if (!isPasswordCorrect) {
      throw new UnauthorizedError();
    }

    // Generate Access Token
    const accessToken = generateAccessToken(user);

    // Generate Refresh Token
    const refreshToken = generateRefreshToken(user);

    // Hash Refresh Token
    const tokenHash = hashToken(refreshToken);

    // Save Refresh Token in Database
    await refreshTokenRepository.create({
      userId: user.id,

      tokenHash,

      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return {
      user: {
        id: user.id,

        name: user.name,

        email: user.email,

        role: user.role,
      },

      accessToken,

      refreshToken,
    };
  }

  async refreshToken(token) {
    const hashedToken = hashToken(token);

    const storedToken = await refreshTokenRepository.findByHash(hashedToken);

    if (!storedToken) {
      throw new UnauthorizedError('Refresh token is invalid');
    }

    if (storedToken.expiresAt < new Date()) {
      throw new UnauthorizedError('Refresh token has expired');
    }

    const payload = jwt.verify(token, config.jwt.secret);

    const user = await userRepository.findById(payload.id);

    if (!user) {
      throw new UnauthorizedError();
    }

    const accessToken = generateAccessToken(user);

    return {
      accessToken,
    };
  }
}

module.exports = new AuthService();
