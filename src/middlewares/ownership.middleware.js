const ForbiddenError = require('../errors/ForbiddenError');

function checkOwnership(req, res, next) {
  const requestedUserId = Number(req.params.id);
  const authenticatedUserId = Number(req.user.id);

  if (requestedUserId !== authenticatedUserId) {
    return next(new ForbiddenError('You do not have permission to access this resource'));
  }

  next();
}

module.exports = checkOwnership;
