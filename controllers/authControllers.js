const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const bcrypt = require("bcrypt");
const cookieOptions = {
  expires: new Date(
    Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
  ),
  // only in development in localhost
  // always send cokkie in encrypted https (production)
  secures: false,
  // cannot be access or modified by the browser or client
  httpOnly: true,
};
const createToken = (id) => jwt.sign({ id }, "MYULTRA_SECRET_JWT_KEY");
const sendCookieJWTAndUser = async (res, user, status) => {
  const token = await createToken(user._id);
  res.cookie("token", token, cookieOptions);
  res.status(status).json({
    status: "Success",
    user,
  });
};
exports.signup = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError(`Please provide email or password`, 400));
  const isUserExist = await User.findOne({ email: req.body.email });
  if (isUserExist)
    return next(new AppError(`User already exist! Try to Login`, 400));
  const user = await User.create(req.body);
  const token = await jwt.sign({ id: user._id }, "MYULTRA_SECRET_JWT_KEY", {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  // res.cookie("token", token, cookieOptions);
  // res.status(201).json({
  //   status: "Success",
  //   user,
  // });
  sendCookieJWTAndUser(res, user, 201);
});
exports.protect = catchAsync(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token)
    return next(
      new AppError(`you are not logged in , please log in to get access`, 400)
    );
  try {
    const decoded = await jwt.verify(token, "MYULTRA_SECRET_JWT_KEY");
    const user = await User.findById(decoded.id);
    if (!user)
      return next(new AppError(`User no longer exist in our System`, 400));
    req.user = user;
  } catch (error) {
    next(new AppError(`Invalid user or token , please login again `, 400));
  }
  // In future we also need to consider that weather user recently changed thier password if yes then do JWT opertation
  next();
});
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError(`Please proivde email or password`, 400));
  const user = await User.findOne({ email: req.body.email }).select(
    "+password"
  );
  if (!user) return next(new AppError(`Incorrect email or password`, 400));
  const correct = await user.correctPassword(password, user.password);
  if (!correct)
    if (!correct) return next(new AppError(`Incorrect email or pasaword`, 400));
  sendCookieJWTAndUser(res, user, 200);
});
