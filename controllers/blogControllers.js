const mongoose = require("mongoose");
const Blog = require("../models/blogModels");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getAllBlogs = catchAsync(async (req, res, next) => {
  const allBlogs = await Blog.find();
  res.send(allBlogs);
});
exports.getBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog)
      return res
        .status(400)
        .send(`No Blog found with this ID ${req.params.id}`);
    res.status(200).send(blog);
  } catch (error) {
    res.status(400).json({
      status: "Failled",
      message: error.message,
      error: error,
    });
  }
};
exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!blog)
      return res
        .status(400)
        .send(`No Blog found with this ID ${req.params.id}`);
    res.status(200).send(blog);
  } catch (error) {
    res.send("failed");
  }
};
exports.createBlog = catchAsync(async (req, res) => {
  const { _id: user } = req.user;
  const newBlog = await Blog.create({ ...req.body, user });
  res.send(newBlog);
});
exports.deleteBlog = catchAsync(async (req, res, next) => {
  // required authentication ,protect middleware , means a login user and for deleting id blog
  // For deleting any blog it must belongs to signin user
  //  1) anoymonous user can't delete blog
  //  2) login user can only delete his blog
  const hasUserOwn = await Blog.findOne({
    user: req.user._id,
    _id: req.params.id,
  });
  if (!hasUserOwn)
    return next(new AppError(`You does not owwn this blog`, 400));
  const blog = await Blog.findByIdAndDelete(req.params.id);
  if (!blog)
    return next(new AppError(`No Blog found with  ID ${req.params.id}`, 400));
  res.status(200).send(null);
});
