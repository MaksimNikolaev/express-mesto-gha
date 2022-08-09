const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const {
  login,
  createUser,
} = require('./controllers/users');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/Not-found-err');

const app = express();
const { PORT = 3000 } = process.env;

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);
app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use((req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use((err, req, res, next) => {
  res.status(err.statusCode).send({ message: err.message });
});

app.listen(PORT);
