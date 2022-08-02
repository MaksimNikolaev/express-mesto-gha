const Card = require('../models/card');
const {
  BAD_REQUEST_STATUS,
  NOT_FOUND_STATUS,
  INTERNAL_SERVER_ERROR_STATUS,
} = require('../utils/constants');

module.exports.getCards = async (req, res) => {
  try {
    const card = await Card.find({});
    res.send(card);
  } catch (err) {
    res.status(INTERNAL_SERVER_ERROR_STATUS).send({ message: 'Ошибка по умолчанию.' });
  }
};

module.exports.createCard = async (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  try {
    const card = await Card.create({ name, link, owner });
    res.send(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(BAD_REQUEST_STATUS).send({ message: 'Переданы некорректные данные при создании карточки.' });
      return;
    }
    res.status(INTERNAL_SERVER_ERROR_STATUS).send({ message: 'Ошибка по умолчанию.' });
  }
};

module.exports.deleteCardById = async (req, res) => {
  try {
    const card = await Card.findByIdAndRemove(req.params.cardId);
    if (!card) {
      res.status(NOT_FOUND_STATUS).send({ message: 'Карточка с указанным _id не найдена.' });
      return;
    }
    res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(BAD_REQUEST_STATUS).send({ message: 'Переданы некорректные данные при удалении карточки.' });
      return;
    }
    res.status(INTERNAL_SERVER_ERROR_STATUS).send({ message: 'Ошибка по умолчанию.' });
  }
};

module.exports.likeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    );
    if (!card) {
      res.status(NOT_FOUND_STATUS).send({ message: 'Передан несуществующий _id карточки.' });
      return;
    }
    res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(BAD_REQUEST_STATUS).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
      return;
    }
    res.status(INTERNAL_SERVER_ERROR_STATUS).send({ message: 'Ошибка по умолчанию.' });
  }
};

module.exports.dislikeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    );
    if (!card) {
      res.status(NOT_FOUND_STATUS).send({ message: 'Передан несуществующий _id карточки.' });
      return;
    }
    res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(BAD_REQUEST_STATUS).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
      return;
    }
    res.status(INTERNAL_SERVER_ERROR_STATUS).send({ message: 'Ошибка по умолчанию.' });
  }
};
