const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { NOT_FOUND_STATUS } = require('./utils/constants');
const {
  login,
  createUser,
} = require('./controllers/users');
const auth = require('./middlewares/auth');

const app = express();
const { PORT = 3000 } = process.env;

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '62e7cc262609cd7fe77840ac',
  };
  next();
});
app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);
app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use((req, res) => {
  res.status(NOT_FOUND_STATUS).send({ message: 'not found 404' });
});

app.listen(PORT);
