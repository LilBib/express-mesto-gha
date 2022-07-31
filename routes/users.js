const router = require('express').Router();
const {
  getUsers, getUser, createUser, patchUserInfo, patchAvatarInfo,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUser);
router.post('/', createUser);
router.patch('/me', patchUserInfo);
router.patch('/me/avatar', patchAvatarInfo);

module.exports = router;
