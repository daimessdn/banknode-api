const jwt = require("jsonwebtoken");

require("dotenv").config();

const middleware = async (req, res, next) => {
  try {
    let token = req.header("Authorization") || null;

    if (!token || !token.includes("Bearer")) {
      throw new Error("Token expired.");
    }

    token = token.replace("Bearer ", "");

    await jwt.verify(token, process.env.JWT_SECRET);

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      msg: error.message,
    });
  }
};

module.exports = middleware;
