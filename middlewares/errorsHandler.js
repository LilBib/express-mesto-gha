const {
  defaultErrorCode,
  conflictErrorCode,
} = require('../utils/constants');

module.exports.errorsHandler = (err, req, res, next) => {
  if (err.name === 'NotFoundError') {
    res.status(err.statusCode).send({ message: `${err.message}` });
    next();
  } else if (err.name === 'ValidationError') {
    res.status(err.statusCode).send({ message: `${err.message}` });
    next();
  } else if (err.name === 'UnauthorizedError') {
    res.status(err.statusCode).send({ message: `${err.message}` });
    next();
  } else if (err.code === 11000) {
    res.status(conflictErrorCode).send({ message: 'Пользователь с такой почтой уже зарегестрирован' });
  } else if (err.name === 'NoRightsError') {
    res.status(err.statusCode).send({ message: `${err.message}` });
  } else {
    res.status(defaultErrorCode).send({ message: 'Произошла ошибка сервера' });
    next();
  }
};
