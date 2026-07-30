const ForbiddenError = require('../errors/ForbiddenError');

function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ForbiddenError('Access denied: User not authenticated'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ForbiddenError('Access denied: Insufficient permissions'));
    }

    next();
  };
}

module.exports = authorize;
