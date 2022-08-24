const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');

const {
  noRightsErrorCode,
} = require('../utils/constants');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link, _id } = req.body;

  Card.create({ name, link, owner: _id })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Переданы некорректные данные при создании карточки');
      }
      return err;
    })
    .catch(next);
};
module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new NotFoundError('Карточка с указанным _id не найдена');
    })
    .then((card) => {
      if (card.owner.toString() === req.body._id) {
        Card.findByIdAndRemove(card._id)
          // eslint-disable-next-line no-shadow
          .then((card) => res.send({ data: card }))
          .catch((err) => {
            if (err.name === 'ValidationError' || err.name === 'CastError') {
              throw new ValidationError('Переданы некорректные данные при удалении карточки');
            } next(err);
          })
          .catch(next);
      } else {
        const error = new Error('Вы не можете удалить чужую карточку');
        error.statusCode = noRightsErrorCode;
        next(error);
      }
    })
    .catch(next);
};
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.body._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('Передан несуществующий _id карточки');
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new ValidationError('Переданы некорректные данные для постановки лайка');
      }
      next(err);
    })
    .catch(next);
};
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.body._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('Передан несуществующий _id карточки');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new ValidationError('Переданы некорректные данные для снятия лайка');
      }
      next(err);
    })
    .catch(next);
};
