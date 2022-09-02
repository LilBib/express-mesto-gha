const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const process = require('process');
const cors = require('cors');
const { celebrate, Joi, errors } = require('celebrate');
const { errorsHandler } = require('./middlewares/errorsHandler');
const { createUser, login } = require('./controllers/users');
const { requestLogger, errorLogger } = require('./middlewares/logger');
require('dotenv').config();

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true, /* ,
  useCreateIndex: true,
  useFindAndModify: false */
})
  .catch(errorsHandler);
app.use(cors({
  origin: ['http://vladimirmisakyan.mesto.project.nomoredomains.sbs/', 'https://vladimirmisakyan.mesto.project.nomoredomains.sbs/'],
}));
app.use(requestLogger);
app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }).unknown(true),
  }),
  login,
);
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      // eslint-disable-next-line no-useless-escape
      avatar: Joi.string().pattern(/^[htps]{4,5}\:\/{2}([[w]{3}\.])?[\w\-\.\~\:\/\?\#\@\!\$\&\'\(\)\*\+\,\;\=\[\]]+/m, 'link'),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }).unknown(true),
  }),
  createUser,
);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));
app.use('/', require('./routes/nonexistent'));

app.use(errorLogger);
app.use(errors());
app.use(errorsHandler);

app.listen(PORT);
