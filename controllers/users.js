const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.getUsersById = async (req, res) => {
  const user = await User.findById(req.params.id);
  res.send(user);
};

module.exports.updateProfile = async (req, res) => {
  const { name, about } = req.body;
  const user = await User.findByIdAndUpdate(req.user._id, { name, about });
  res.send(user);
};

module.exports.updateAvatar = async (req, res) => {
  const { avatar } = req.body;
  const user = await User.findByIdAndUpdate(req.user._id, { avatar });
  res.send(user);
};
