const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const [User] = require("../models/users.models");
const [Wallet] = require("../models/wallets.models");

const generateRandomWalletNumber = () => {
  return (
    (Math.random() + "").substring(2, 10) +
    (Math.random() + "").substring(2, 10)
  );
};

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const { test } = req.query;

    console.log(test);

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

    const cretaedUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const bankNumber = generateRandomWalletNumber();

    await cretaedUser.createWallet({
      name: bankNumber,
      type: "payment",
      user_id: User.findOne({ where: { email } }).id,
      amount: test ? 500_000 : 0,
    });

    return res.status(201).json({
      success: true,
      msg: "successfully registered.",
      data: {
        name,
        email,
        password: hashedPassword,
        wallet: {
          name: bankNumber,
          type: "payment",
          belongs_to: name,
          amount: test ? 500_000 : 0,
        },
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // check existing users
    const getUser = await User.findOne({ where: { email } });
    if (!getUser) {
      throw new Error("user doesn't exist.");
    }

    // mengecek password
    const isPasswordMatch = await bcrypt.compare(password, getUser.password);
    if (!isPasswordMatch) {
      throw new Error("password doesn't exist.");
    }

    const accessToken = await jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 7 * 24,
        data: { nama: getUser.nama, email },
      },
      process.env.JWT_SECRET
    );

    res.json({
      success: true,
      msg: "berhasil login.",
      data: { token: accessToken },
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
  login,
};
