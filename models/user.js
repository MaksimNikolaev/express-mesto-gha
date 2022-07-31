const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { // у пользователя есть имя — опишем требования к имени в схеме:
    type: String, // имя — это строка
    required: true, // оно должно быть у каждого пользователя, так что имя — обязательное поле
    minlength: 2, // минимальная длина имени — 2 символа
    maxlength: 30, // а максимальная — 30 символов
  },
  about: {
    type: String, // информация о пользователе — это строка
    required: true, // оно должно быть у каждого пользователя,так что информация — обязательное поле
    minlength: 2, // минимальная длина информации — 2 символа
    maxlength: 30, // а максимальная — 30 символов
  },
  avatar: {
    type: String, // аватар — это строка ссылка
    required: true, // оно должно быть у каждого пользователя,так что аватар — обязательное поле
  },
});

module.exports = mongoose.model('user', userSchema);
