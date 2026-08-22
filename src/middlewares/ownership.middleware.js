const ForbiddenError = require('../errors/ForbiddenError');

function checkOwnership(req, res, next) {
  const requestedUserId = Number(req.params.id);
  const authenticatedUserId = Number(req.user.id);

  // Administrators can access any resource.
  if (req.user.role === 'ADMIN') {
    return next();
  }

  // Normal users can only access their own resource.
  if (requestedUserId !== authenticatedUserId) {
    return next(new ForbiddenError('You do not have permission to access this resource'));
  }

  next();
}

module.exports = checkOwnership;
