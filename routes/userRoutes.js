const express = require("express");
const { signup, login } = require("../controllers/authControllers");

const userRoutes = express.Router();

userRoutes.post("/signup", signup);
userRoutes.post("/login", login);

module.exports = userRoutes;
