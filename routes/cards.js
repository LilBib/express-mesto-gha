const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      // eslint-disable-next-line no-useless-escape
      link: Joi.string().required().pattern(/^[htps]{4,5}\:\/{2}([[w]{3}\.])?[\w\-\.\~\:\/\?\#\@\!\$\&\'\(\)\*\+\,\;\=\[\]]+/m, 'link'),
    }).unknown(true),
  }),
  auth,
  createCard,
);
router.get('/', auth, getCards);
router.delete(
  '/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().pattern(/\w{24}/, 'id'),
    }).unknown(true),
  }),
  auth,
  deleteCard,
);
router.put(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().pattern(/\w{24}/, 'id'),
    }).unknown(true),
  }),
  auth,
  likeCard,
);
router.delete(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().pattern(/\w{24}/, 'id'),
    }).unknown(true),
  }),
  auth,
  dislikeCard,
);

module.exports = router;
