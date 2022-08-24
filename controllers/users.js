const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const { secretKey } = require('../utils/constants');
const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};
module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      next(new NotFoundError('Пользователь по указанному _id не найден'));
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Передан неверный id пользователя'));
      }
      next(err);
    });
};
module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hashedPassword) => {
      User.create({
        name, about, avatar, email, password: hashedPassword,
      })
        .then((user) => {
          if (validator.isEmail(user.email)) {
            // eslint-disable-next-line no-param-reassign
            // user.password = password;
            return user;
          }
          return new ValidationError('Неверно введена почта');
        })
        .then((result) => res.send({ data: result }))
        .catch(next);
    });
};
module.exports.patchUserInfo = (req, res, next) => {
  const { name, about, _id } = req.body;
  User.findByIdAndUpdate(
    _id,
    { name, about },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .orFail(() => {
      throw new NotFoundError('Пользователь по указанному _id не найден');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Переданы некорректные данные при обновлении профиля');
      }
    })
    .catch(next);
};
module.exports.patchAvatarInfo = (req, res, next) => {
  const { avatar, _id } = req.body;
  User.findByIdAndUpdate(
    _id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => {
      throw new NotFoundError('Пользователь по указанному _id не найден');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Переданы некорректные данные при обновлении аватара');
      }
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, secretKey, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(() => {
      next(new UnauthorizedError('Ошибка авторизации'));
    });
};
module.exports.getCurrentUser = (req, res, next) => {
  User.findOne({ id: req.body._id })
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};
