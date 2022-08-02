const { notFoundErrorCode } = require('../utils/constants');

const responseOnNonexistentRoute = (req, res) => {
  res.status(notFoundErrorCode).send({ message: 'Такого адреса не существует' });
};

module.exports = responseOnNonexistentRoute;
