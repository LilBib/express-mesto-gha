class NoRightsError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NoRightsError';
    this.statusCode = 403;
  }
}
module.exports = NoRightsError;
