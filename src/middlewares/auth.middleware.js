const { verifyAccessToken } = require('../utils/jwt');
const userRepository = require('../repositories/user.repository');
const UnauthorizedError = require('../errors/UnauthorizedError');
const asyncHandler = require('../utils/asyncHandler');

const authMiddleware = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Access token is missing or invalid');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyAccessToken(token);

    // Fetch user from DB to ensure user exists and role is fresh
    const user = await userRepository.findById(decoded.id);
    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    throw new UnauthorizedError('Invalid or expired access token');
  }
});

module.exports = authMiddleware;
