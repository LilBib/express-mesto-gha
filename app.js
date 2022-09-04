require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const process = require('process');
const cors = require('cors');
const { celebrate, Joi, errors } = require('celebrate');
const { errorsHandler } = require('./middlewares/errorsHandler');
const { createUser, login } = require('./controllers/users');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const auth = require('./middlewares/auth');
const { URLregex } = require('./utils/constants');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true, /* ,
  useCreateIndex: true,
  useFindAndModify: false */
})
  .catch(errorsHandler);

app.options('*', cors());
app.use(cors());
app.use(requestLogger);
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
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
      avatar: Joi.string().pattern(URLregex, 'link'),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  createUser,
);

app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));
app.use('/', require('./routes/nonexistent'));

app.use(errorLogger);
app.use(errors());
app.use(errorsHandler);

app.listen(PORT);
