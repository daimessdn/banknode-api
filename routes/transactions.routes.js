const express = require("express");

const { transfer } = require("../controllers/transactions.controllers");

const transactionRouter = express.Router();

transactionRouter.post("/transaction/transfer", transfer);

module.exports = { transactionRouter };
