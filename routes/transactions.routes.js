const express = require("express");

const {
  transfer,
  get_transaction_history,
} = require("../controllers/transactions.controllers");

const transactionRouter = express.Router();

transactionRouter.post("/transaction/transfer", transfer);

transactionRouter.get(
  "/transaction/history/:bank_account",
  get_transaction_history
);

module.exports = { transactionRouter };
