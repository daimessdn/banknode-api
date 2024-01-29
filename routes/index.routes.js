const express = require("express");

const { userRouter } = require("./users.routes");
const { transactionRouter } = require("./transactions.routes");

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    msg: "hello, world!",
  });
});

module.exports = [router, userRouter, transactionRouter];
