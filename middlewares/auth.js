const jwt = require('jsonwebtoken');
const constants = require('../utils/constants');
const UnauthorizedError = require('../errors/UnauthorizedError');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, constants.secretKey);
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация'));
  }

  req.body._id = payload._id;
  next();
};
