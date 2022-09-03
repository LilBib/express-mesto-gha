const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const NoRightsError = require('../errors/NoRightsError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError('Переданы некорректные данные при добавлении карточки'));
      }
      return next(err);
    });
};
module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => next(new NotFoundError('Карточка с указанным _id не найдена')))
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        Card.findByIdAndRemove(card._id)
          // eslint-disable-next-line no-shadow
          .then((card) => res.send({ data: card }))
          .catch(next);
      } else {
        return next(new NoRightsError('Нельзя удалять чужие карточки!'));
      }
    })
    .catch(next);
};
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(() => next(new NotFoundError('Передан несуществующий _id карточки')))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'Cast error') {
        // eslint-disable-next-line no-param-reassign
        err.message = 'Неверный _id карточки';
        return next(err);
      }
      return next(err);
    });
};
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(() => next(new NotFoundError('Передан несуществующий _id карточки')))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'Cast error') {
        // eslint-disable-next-line no-param-reassign
        err.message = 'Неверный _id карточки';
        return next(err);
      }
      return next(err);
    });
};
