const responseOnNonexistentRoute = (req, res) => {
  res.status(404).send({ message: 'Такого адреса не существует' });
};

module.exports = responseOnNonexistentRoute;
