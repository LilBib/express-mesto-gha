const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');
require('dotenv').config();

const { JWT_SECRET } = process.env;

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError('Необходима авторизация'));
    return;
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация'));
    console.log(err);
    return;
  }

  req.user = { _id: payload._id };
  next();
};
