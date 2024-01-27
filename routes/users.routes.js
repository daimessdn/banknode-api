const express = require("express");

const { get_all_users, register } = require("../controllers/users.controllers");

const userRouter = express.Router();

userRouter.get("/users", get_all_users);

userRouter.post("/users/register", register);

module.exports = { userRouter };
