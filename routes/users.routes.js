const express = require("express");

const {
  get_all_users,
  register,
  login,
  get_walet_info,
} = require("../controllers/users.controllers");

const userRouter = express.Router();

userRouter.get("/users", get_all_users);

userRouter.get("/users/wallet/:user_id", get_walet_info);

userRouter.post("/users/register", register);
userRouter.post("/users/login", login);

module.exports = { userRouter };
