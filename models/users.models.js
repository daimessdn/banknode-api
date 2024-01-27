const { Sequelize, DataTypes } = require("sequelize");

// config
const config = require("../db/config");
const { host, port, username, password, database } = config;

const sequelize = new Sequelize(database, username, password, {
  host,
  dialect: "mysql",
  define: { underscored: true },
});

const User = sequelize.define("user", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

sequelize
  .sync()
  .then(() => {
    console.log("successfully created users table.");
  })
  .catch((error) => {
    console.error("failed to create table: ", error);
  });

const createUserTable = async () => {
  await sequelize
    .sync()
    .then(() => {
      console.log("successfully created users.");
    })
    .catch((error) => {
      console.error("failed to create table: ", error);
    });
};

module.exports = [User, createUserTable];
