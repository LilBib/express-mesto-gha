const { conflictErrorCode } = require('../utils/constants');

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConflictError';
    this.statusCode = conflictErrorCode;
  }
}
module.exports = ConflictError;
