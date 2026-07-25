const bcrypt = require('bcrypt');

const userRepository = require('../repositories/user.repository');
const ConflictError = require('../errors/ConflictError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const { generateAccessToken } = require('../utils/jwt');

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

    const accessToken = generateAccessToken(user);

    return {
      user: {
        id: user.id,

        name: user.name,

        email: user.email,
      },

      accessToken,
    };
  }
}

module.exports = new AuthService();
