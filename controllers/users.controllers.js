const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const [User] = require("../models/users.models");
const [Wallet] = require("../models/wallets.models");
const [Transaction] = require("../models/transactions.models");

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

    console.log("ini email,", email);
    console.log("ini password,", password);

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

    const userWallet = await Wallet.findOne({ where: { user_id: getUser.id } });

    const accessToken = await jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 7 * 24,
        data: {
          id: getUser.id,
          name: getUser.name,
          email,
          wallet_account: userWallet.name,
        },
      },
      process.env.JWT_SECRET
    );

    res.json({
      success: true,
      msg: "successfully login.",
      data: { token: accessToken },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};

const get_walet_info = async (req, res, next) => {
  const { user_id } = req.params;

  const getWallet = await Wallet.findOne({ where: { id: user_id } });

  res.status(200).json({
    success: true,
    msg: "successfully get wallet info.",
    data: getWallet,
  });
};

const get_recent_transfer = async (req, res, next) => {
  const { wallet_account } = req.params;
  const getWallet = await Wallet.findOne({ where: { name: wallet_account } });
  const getAllRecentTransfers = await Transaction.findAll({
    where: { transaction_from: getWallet.id },
  });

  const getRecentUsers = [];

  for (let i = 0; i < getAllRecentTransfers.length; i++) {
    const getRecipientWallet = await Wallet.findOne({
      where: { id: getAllRecentTransfers[i].transaction_to },
      attributes: ["id", "name", "type", "user_id"],
    });
    const getRecipientUser = await User.findOne({
      where: { id: getRecipientWallet.user_id },
      attributes: ["id", "name", "email"],
    });

    getRecentUsers.push({
      ...getRecipientWallet.dataValues,
      user_details: { ...getRecipientUser.dataValues },
    });
  }

  res.status(200).json({
    success: true,
    msg: "successfully get recent transfers users",
    data: getRecentUsers,
  });
};

const get_all_users = (req, res) => {
  res.status(200).json({
    msg: "hello, world!",
    user_details: { ...getRecipientUser.dataValues },
  });
};

module.exports = {
  get_all_users,
  get_walet_info,
  get_recent_transfer,

  register,
  login,
};
