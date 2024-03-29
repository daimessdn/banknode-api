const Sequelize = require("sequelize");
const mysql = require("mysql2/promise");

// model
const [User, createUserTable] = require("../models/users.models");
const [Wallet, createWalletTable] = require("../models/wallets.models");
const [
  Transaction,
  createTransactionTable,
] = require("../models/transactions.models");
// config
const config = require("./config");
const { host, port, username, password, database } = config;

module.exports = db = {};

const initialize = async () => {
  const connection = mysql.createConnection({
    host: host,
    port: port,
    user: username,
    password: password,
  });

  (await connection).query(`CREATE DATABASE IF NOT EXISTS ${database};`);

  const sequelize = new Sequelize(database, username, password, {
    host,
    dialect: "mysql",
    define: {
      freezeTableName: true,
    },
  });

  await sequelize
    .authenticate()
    .then(async () => {
      console.log("successfuly init sequelize.");

      await createUserTable();
      await createWalletTable();
      await createTransactionTable();
    })
    .catch((error) => {
      console.error("failed to connect database: ", error);
    });

  console.log("database connected");
};

module.exports = initialize;
