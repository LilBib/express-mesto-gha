const { defaultErrorCode } = require('../utils/constants');

module.exports.errorsHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || defaultErrorCode;
  const message = statusCode === 500 ? 'Произошла ошибка сервера' : err.message;
  res.status(statusCode).send({ message });
  next();
};
