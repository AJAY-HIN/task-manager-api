const jwt = require('jsonwebtoken');

const config = require('../config/env');

function generateAccessToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    config.jwt.secret,
    {
      expiresIn: config.jwt.expiresIn,
    }
  );
}

function verifyAccessToken(token) {
  return jwt.verify(token, config.jwt.secret);
}

function generateRefreshToken(user) {
  return jwt.sign(
    {
      id: user.id,
    },

    config.jwt.secret,

    {
      expiresIn: '7d',
    }
  );
}

module.exports = {
  generateAccessToken,
  verifyAccessToken,
  generateRefreshToken,
};
