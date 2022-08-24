const {
  validationErrorCode,
  notFoundErrorCode,
  defaultErrorCode,
  unauthorizedErrorCode,
  conflictErrorCode,
  noRightsErrorCode,
} = require('../utils/constants');

module.exports.errorsHandler = (err, req, res, next) => {
  if (err.name === 'NotFoundError') {
    res.status(notFoundErrorCode).send({ message: `${err.message}` });
    next();
  }
  if (err.name === 'ValidationError') {
    res.status(validationErrorCode).send({ message: `${err.message}` });
    next();
  }
  if (err.name === 'UnauthorizedError') {
    res.status(unauthorizedErrorCode).send({ message: `${err.message}` });
    next();
  }
  if (err.code === 11000) {
    res.status(conflictErrorCode).send({ message: 'Пользователь с такой почтой уже зарегестрирован' });
  }
  if (err.statusCode === noRightsErrorCode) {
    res.status(noRightsErrorCode).send({ message: `${err.message}` });
  }
  res.status(defaultErrorCode).send({ message: 'Произошла ошибка сервера' });
  next();
};
