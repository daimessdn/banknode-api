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
};

const get_transaction_history = async (req, res) => {
  const { bank_account } = req.params;

  console.log(typeof bank_account);

  // get bank account info
  const getBankAccount = await Wallet.findOne({
    where: { name: bank_account },
  });

  const getAllTransaction = await Transaction.findAll({
    where: {
      [Op.or]: [
        { transaction_from: getBankAccount.id },
        { transaction_to: getBankAccount.id },
      ],
    },
  });

  res.status(200).json({
    success: true,
    msg: "successfully created transaction",
    data: getAllTransaction,
  });
};

module.exports = { transfer, get_transaction_history };
