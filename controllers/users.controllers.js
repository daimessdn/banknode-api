const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const [User, _] = require("../models/users.models");

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // check for incomplete parameters
    if (!name || !email || !password) {
      throw new Error("incomplete parameters.");
    }

    const hashedPassword = bcrypt.hashSync(password, 8);

    // check for registered email
    const isExistingEmail = await User.findOne({
      where: { email },
    });
    if (isExistingEmail) {
      throw new Error("email already exists.");
    }

    await User.create({ name, email, password: hashedPassword });

    return res.status(201).json({
      success: true,
      msg: "successfully registered.",
      data: { name, email, password: hashedPassword },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};

const get_all_users = (req, res) => {
  res.status(200).json({
    msg: "hello, world!",
  });
};

module.exports = {
  get_all_users,

  register,
};
