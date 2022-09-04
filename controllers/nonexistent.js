const NotFoundError = require('../errors/NotFoundError');

const responseOnNonexistentRoute = (req, res, next) => {
  const err = new NotFoundError('Такого адреса не существует');
  return next(err);
};

module.exports = responseOnNonexistentRoute;
