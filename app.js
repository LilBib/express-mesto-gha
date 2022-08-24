const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const process = require('process');
const { errors } = require('celebrate');
const errorsHandler = require('./middlewares/errorsHandler');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true, /* ,
  useCreateIndex: true,
  useFindAndModify: false */
});
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));
app.use('/', require('./routes/nonexistent'));

app.use(errors());
app.use(errorsHandler);

app.listen(PORT);
