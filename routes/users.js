const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const {
  getUsers, getUser, patchUserInfo, patchAvatarInfo, getCurrentUser,
} = require('../controllers/users');

router.get('/', auth, getUsers);
router.get('/me', auth, getCurrentUser);
router.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().required().length(24),
    }).unknown(true),
  }),
  auth,
  getUser,
);
router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }).unknown(true),
  }),
  auth,
  patchUserInfo,
);
router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      // eslint-disable-next-line no-useless-escape
      avatar: Joi.string().pattern(/^[htps]{4,5}\:\/{2}([[w]{3}\.])?[\w\-\.\~\:\/\?\#\@\!\$\&\'\(\)\*\+\,\;\=\[\]]+/m, 'link'),
    }).unknown(true),
  }),
  auth,
  patchAvatarInfo,
);

module.exports = router;
