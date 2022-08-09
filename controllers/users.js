const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  BAD_REQUEST_STATUS,
  UNAUTHORIZED_STATUS,
  NOT_FOUND_STATUS,
  INTERNAL_SERVER_ERROR_STATUS,
  CREATED_STATUS,
} = require('../utils/constants');

module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findUserByCredentials(email, password);
    if (!user) {
      res.status(UNAUTHORIZED_STATUS).send({ message: 'Неправильные почта или пароль.' });
      return;
    }
    const checkPass = await bcrypt.compare(password, user.password);
    if (!checkPass) {
      res.status(UNAUTHORIZED_STATUS).send({ message: 'Неправильные почта или пароль.' });
      return;
    }
    const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
    res.send({ token });
  } catch (err) {
    res.status(BAD_REQUEST_STATUS).send({ message: `Переданы некорректные данные ${err}` });
    res.status(INTERNAL_SERVER_ERROR_STATUS).send({ message: 'Ошибка по умолчанию.' });
  }
};

module.exports.getUsers = async (req, res) => {
  try {
    const user = await User.find({});
    res.send(user);
  } catch (err) {
    res.status(BAD_REQUEST_STATUS).send({ message: `Переданы некорректные данные ${err}` });
    res.status(INTERNAL_SERVER_ERROR_STATUS).send({ message: 'Ошибка по умолчанию.' });
  }
};

module.exports.getUser = async (req, res) => {
  try {
    const user = await User.find(req.user._id);
    res.send(user);
  } catch (err) {
    res.status(BAD_REQUEST_STATUS).send({ message: `Переданы некорректные данные ${err}` });
    res.status(INTERNAL_SERVER_ERROR_STATUS).send({ message: 'Ошибка по умолчанию.' });
  }
};

module.exports.createUser = async (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  try {
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name, about, avatar, email, password: hashPassword,
    });
    res.status(CREATED_STATUS).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(BAD_REQUEST_STATUS).send({ message: `Переданы некорректные данные при создании пользователя ${err}` });
      return;
    }
    res.status(INTERNAL_SERVER_ERROR_STATUS).send({ message: 'Ошибка по умолчанию.' });
  }
};

module.exports.getUsersById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      res.status(NOT_FOUND_STATUS).send({ message: 'Пользователь по указанному _id не найден' });
      return;
    }
    res.send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(BAD_REQUEST_STATUS).send({ message: 'Переданы некорректные данные.' });
      return;
    }
    res.status(INTERNAL_SERVER_ERROR_STATUS).send({ message: 'Ошибка по умолчанию.' });
  }
};

module.exports.updateProfile = async (req, res) => {
  const { name, about } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      {
        new: true, // обработчик получит на вход обновлённую запись
        runValidators: true, // данные будут валидированы перед изменением
        upsert: false, // если пользователь не найден, он будет создан
      },
    );
    if (!user) {
      res.status(NOT_FOUND_STATUS).send({ message: 'Пользователь по указанному _id не найден.' });
      return;
    }
    res.send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(BAD_REQUEST_STATUS).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      return;
    }
    if (err.name === 'ValidationError') {
      res.status(BAD_REQUEST_STATUS).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      return;
    }
    res.status(INTERNAL_SERVER_ERROR_STATUS).send({ message: 'Ошибка по умолчанию.' });
  }
};

module.exports.updateAvatar = async (req, res) => {
  const { avatar } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      {
        new: true, // обработчик получит на вход обновлённую запись
        runValidators: true, // данные будут валидированы перед изменением
        upsert: false, // если пользователь не найден, он будет создан
      },
    );
    if (!user) {
      res.status(NOT_FOUND_STATUS).send({ message: 'Пользователь по указанному _id не найден.' });
      return;
    }
    res.send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(BAD_REQUEST_STATUS).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      return;
    }
    if (err.name === 'ValidationError') {
      res.status(BAD_REQUEST_STATUS).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      return;
    }
    res.status(INTERNAL_SERVER_ERROR_STATUS).send({ message: 'Ошибка по умолчанию.' });
  }
};
