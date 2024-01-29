const { Sequelize, DataTypes } = require("sequelize");

// config
const config = require("../db/config");
const { host, port, username, password, database } = config;

const [User, _] = require("./users.models");

const sequelize = new Sequelize(database, username, password, {
  host,
  dialect: "mysql",
  define: { underscored: true },
});

const Transaction = sequelize.define("transaction", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  transaction_from: {
    type: DataTypes.STRING(16),
    allowNull: false,
  },
  transaction_to: {
    type: DataTypes.STRING(16),
    allowNull: false,
  },
  transaction_amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  transaction_description: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
  },
});

const createTransactionTable = async () => {
  await sequelize
    .sync()
    .then(() => {
      console.log("successfully created transaction table.");
    })
    .catch((error) => {
      console.error("failed to create table: ", error);
    });
};

module.exports = [Transaction, createTransactionTable];
