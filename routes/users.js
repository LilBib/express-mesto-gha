const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { URLregex } = require('../utils/constants');
const {
  getUsers, getUser, patchUserInfo, patchAvatarInfo, getCurrentUser,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().required().length(24),
    }),
  }),
  getUser,
);
router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  patchUserInfo,
);
router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      // eslint-disable-next-line no-useless-escape
      avatar: Joi.string().pattern(URLregex, 'link'),
    }),
  }),
  patchAvatarInfo,
);

module.exports = router;
