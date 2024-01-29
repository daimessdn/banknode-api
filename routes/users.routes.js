const express = require("express");

const {
  get_all_users,
  register,
  login,
} = require("../controllers/users.controllers");

const userRouter = express.Router();

userRouter.get("/users", get_all_users);

userRouter.post("/users/register", register);
userRouter.post("/users/login", login);

module.exports = { userRouter };
