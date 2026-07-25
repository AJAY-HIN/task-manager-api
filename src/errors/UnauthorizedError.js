const AppError = require('./AppError');

class UnauthorizedError extends AppError {
  constructor(message = 'Invalid credentials') {
    super(message, 401);
  }
}

module.exports = UnauthorizedError;
