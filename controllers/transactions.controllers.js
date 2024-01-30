const [User, _] = require("../models/users.models");
const [Wallet, createWalletTable] = require("../models/wallets.models");
const [
  Transaction,
  createTransactionTable,
] = require("../models/transactions.models");
const { Op } = require("sequelize");

const transfer = async (req, res) => {
  const {
    transaction_from,
    transaction_to,
    transaction_amount,
    transaction_description,
  } = req.body;

  try {
    // get bank account info
    const accountFrom = await Wallet.findOne({
      where: { name: transaction_from },
    });
    const accountTo = await Wallet.findOne({ where: { name: transaction_to } });

    const finalAmount = {
      from: accountFrom.amount - transaction_amount,
      to: accountTo.amount + transaction_amount,
    };

    await accountFrom.update({ amount: finalAmount.from });
    await accountTo.update({ amount: finalAmount.to });

    await Transaction.create({
      transaction_from: accountFrom.id,
      transaction_to: accountTo.id,
      transaction_amount,
      transaction_description,
    });

    res.status(200).json({
      success: true,
      msg: "successfully created transaction",
      data: {},
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};

const get_transaction_history = async (req, res) => {
  const { bank_account } = req.params;

  try {
    // get bank account info
    const getBankAccount = await Wallet.findOne({
      where: { name: bank_account },
    });

    let getAllTransactions = await Transaction.findAll({
      where: {
        [Op.or]: [
          { transaction_from: getBankAccount.id },
          { transaction_to: getBankAccount.id },
        ],
      },
    });
    getAllTransactions = getAllTransactions.map(
      (transaction) => transaction.dataValues
    );

    const getTransactionDetails = [];

    for (let i = 0; i < getAllTransactions.length; i++) {
      const fromDetails = await Wallet.findOne({
        where: { id: getAllTransactions[i].transaction_from },
        attributes: ["id", "name", "user_id"],
      });
      const userFromDetails = await User.findOne({
        where: { id: fromDetails.user_id },
        attributes: ["id", "name", "email"],
      });

      const toDetails = await Wallet.findOne({
        where: { id: getAllTransactions[i].transaction_to },
        attributes: ["id", "name", "user_id"],
      });
      const userToDetails = await User.findOne({
        where: { id: toDetails.user_id },
        attributes: ["id", "name", "email"],
      });

      getTransactionDetails.push({
        ...getAllTransactions[i],
        transaction_from_details: {
          ...fromDetails.dataValues,
          user_details: userFromDetails,
        },
        transaction_to_details: {
          ...toDetails.dataValues,
          user_details: userToDetails,
        },
      });
    }

    res.status(200).json({
      success: true,
      msg: "successfully get transactions hsitory",
      data: getTransactionDetails,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};

const get_transaction_details = async (req, res) => {
  const { id } = req.params;

  try {
    // get bank account info
    let getTransaction = await Transaction.findOne({
      where: {
        id,
      },
    });

    const fromDetails = await Wallet.findOne({
      where: { id: getTransaction.transaction_from },
      attributes: ["id", "name", "user_id"],
    });
    const userFromDetails = await User.findOne({
      where: { id: fromDetails.user_id },
      attributes: ["id", "name", "email"],
    });

    const toDetails = await Wallet.findOne({
      where: { id: getTransaction.transaction_to },
      attributes: ["id", "name", "user_id"],
    });
    const userToDetails = await User.findOne({
      where: { id: toDetails.user_id },
      attributes: ["id", "name", "email"],
    });

    res.status(200).json({
      success: true,
      msg: "successfully get transaction details",
      data: {
        ...getTransaction.dataValues,
        transaction_from_details: {
          ...fromDetails.dataValues,
          user_details: userFromDetails,
        },
        transaction_to_details: {
          ...toDetails.dataValues,
          user_details: userToDetails,
        },
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};

module.exports = { transfer, get_transaction_history, get_transaction_details };
