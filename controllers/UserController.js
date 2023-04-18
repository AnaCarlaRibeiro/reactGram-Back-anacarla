const User = require("../models/User");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");

const jwtSecret = process.env.JWT_SECRET;

//generate user Token
const generateToken = (id) => {
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: "7d",
  });
};
const register = async (req, res) => {
  const { name, email, password } = req.body;

  //checando se existe usuário pelo e-mail

  const user = await User.findOne({ email });

  if (user) {
    res.status(422).json({ errors: ["Por favor, utilize outro e-mail"] });
    return;
  }
  //hash senha
  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(password, salt);

  //criando usuário

  const newUser = await User.create({
    name,
    email,
    password: passwordHash,
  });

  // se criado com sucesso retornará o token

  if (!newUser) {
    res
      .status(422)
      .json({ error: ["Houve um erro, por favor tente mais tarde."] });
    return;
  }
  res.status(201).json({
    _id: newUser._id,
    token: generateToken(newUser._id),
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404).json({ error: ["Usuário não encontrado"] });
    return;
  }

  // conferindo se a senha que o usuário mandou
  if (!(await bcrypt.compare(password, user.password))) {
    res.status(422).json({ erros: ["Senha inválida"] });
    return;
  }

  //retornar usuário com token
  res.status(201).json({
    _id: user._id,
    profileImage: user.profileImage,
    token: generateToken(user._id),
  });
};

const getCurrentUser = async (req, res) => {
  const user = req.user;

  res.status(200).json(user);
};

const update = async (req, res) => {
  const { name, password, bio } = req.body;

  let profileImage = null;
  if (req.file) {
    profileImage = req.file.filename;
  }

  const reqUser = req.user;
  const user = await User.findById(
    new mongoose.Types.ObjectId(reqUser._id)
  ).select("-password");

  if (name) {
    user.name = name;
  }

  if (password) {
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    user.password = passwordHash;
  }

  if (profileImage) {
    user.profileImage = profileImage;
  }

  if (bio) {
    user.bio = bio;
  }

  await user.save();

  res.status(200).json(user);
};

const getUserById = async (req, res) => {
  const { id } = req.params;

try {
  const user = await User.findById(new mongoose.Types.ObjectId(id)).select(
    "-password"
  );
  
    //checando se o usuário existe
    if (!user) {
      res.status(404).json({ errors: ["Usuário não encontrado"] });
      return;
    }
    res.status(200).json(user);
} catch (error) {
  res.status(404).json({ errors: ["Usuário não encontrado-Id inválido"] });
    return;
}
};

module.exports = {
  register,
  login,
  getCurrentUser,
  update,
  getUserById
};
