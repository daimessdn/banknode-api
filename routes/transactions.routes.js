const express = require("express");

const {
  transfer,
  get_transaction_history,
  get_transaction_details,
} = require("../controllers/transactions.controllers");

const { get_recent_transfer } = require("../controllers/users.controllers");

const transactionRouter = express.Router();

transactionRouter.post("/transaction/transfer", transfer);

transactionRouter.get("/transaction/:id", get_transaction_details);
transactionRouter.get(
  "/transaction/history/:bank_account",
  get_transaction_history
);
transactionRouter.get(
  "/transaction/transfer/recents/:wallet_account",
  get_recent_transfer
);

module.exports = { transactionRouter };
