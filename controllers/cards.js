const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const { validationErrorCode, notFoundErrorCode, defaultErrorCode } = require('../utils/constants');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(defaultErrorCode).send({ message: 'Произошла ошибка сервера' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Переданы некорректные данные при создании карточки');
      }
      return err;
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(validationErrorCode).send({ message: `${err.message}` });
        return;
      }
      res.status(defaultErrorCode).send({ message: 'Произошла ошибка сервера' });
    });
};
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      throw new NotFoundError('Карточка с указанным _id не найдена');
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(validationErrorCode).send({ message: 'Переданы некорректные данные удаления карточки' });
        return;
      }
      if (err.name === 'NotFoundError') {
        res.status(notFoundErrorCode).send({ message: `${err.message}` });
        return;
      }
      res.status(defaultErrorCode).send({ message: 'Произошла ошибка сервера' });
    });
};
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('Передан несуществующий _id карточки');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(validationErrorCode).send({ message: 'Переданы некорректные данные для постановки лайка' });
        return;
      }
      if (err.name === 'NotFoundError') {
        res.status(notFoundErrorCode).send({ message: `${err.message}` });
        return;
      }
      res.status(defaultErrorCode).send({ message: 'Произошла ошибка сервера' });
    });
};
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('Передан несуществующий _id карточки');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        res.status(notFoundErrorCode).send({ message: `${err.message}` });
        return;
      }
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(validationErrorCode).send({ message: 'Переданы некорректные данные для снятия лайка' });
        return;
      }
      res.status(defaultErrorCode).send({ message: 'Произошла ошибка сервера' });
    });
};
