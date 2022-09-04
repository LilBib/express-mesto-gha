const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { URLregex, idRegex } = require('../utils/constants');
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      // eslint-disable-next-line no-useless-escape
      link: Joi.string().required().pattern(URLregex, 'link'),
    }),
  }),
  createCard,
);
router.get('/', getCards);
router.delete(
  '/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().pattern(idRegex, 'id'),
    }),
  }),
  deleteCard,
);
router.put(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().pattern(idRegex, 'id'),
    }),
  }),
  likeCard,
);
router.delete(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().pattern(idRegex, 'id'),
    }),
  }),
  dislikeCard,
);

module.exports = router;
