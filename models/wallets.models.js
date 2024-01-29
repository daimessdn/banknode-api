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

const Wallet = sequelize.define("wallet", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(16),
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM(["deposit", "payment"]),
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: "id",
    },
  },
});

User.hasMany(Wallet);
Wallet.belongsTo(User);

const createWalletTable = async () => {
  await sequelize
    .sync()
    .then(() => {
      console.log("successfully created wallet table.");
    })
    .catch((error) => {
      console.error("failed to create table: ", error);
    });
};

module.exports = [Wallet, createWalletTable];
