const express = require("express");
const {
  signup,
  login,
  protect,
  updateMe,
} = require("../controllers/authControllers");

const userRoutes = express.Router();

userRoutes.post("/signup", signup);
userRoutes.post("/login", login);
userRoutes.post("/update-me", protect, updateMe);

module.exports = userRoutes;
