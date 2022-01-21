const mongoose = require("mongoose");
const Blog = require("../models/blogModels");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const multer = require("multer");
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `blogs-${req.user.id}-${Date.now()}.${ext}`);
  },
});
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError(`Only image is allowed`), false);
  }
};
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadBlogPhoto = upload.single("photo");
exports.getAllBlogs = catchAsync(async (req, res, next) => {
  const allBlogs = await Blog.find();
  res.status.json({
    status: "Success",
    allBlogs,
  });
});
exports.getBlog = catchAsync(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog)
    return next(new AppError(`No Blog found with ID ${req.params.id}`, 400));
  res.status(200).send(blog);
});
exports.updateBlog = catchAsync(async (req, res, next) => {
  if (req.file) req.body.photo = req.file.filename;
  const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!blog) return next(new AppError(`no blog found given filter`, 400));
  res.status(200).send(blog);
});
exports.createBlog = catchAsync(async (req, res) => {
  const { _id: user } = req.user;
  console.log(req.body);
  const newBlog = await Blog.create({ ...req.body, user });
  res.send(newBlog);
});

exports.hasUserOwn = catchAsync(async (req, res, next) => {
  const isOwn = await Blog.findOne({
    user: req.user.id,
    id: req.params.id,
  });
  if (!isOwn) return next(new AppError(`You do not own this blog`, 400));

  next();
});
exports.deleteBlog = catchAsync(async (req, res, next) => {
  //For this action required  protect and hasOwnUser middleware
  const blog = await Blog.findByIdAndDelete(req.params.id);
  if (!blog)
    return next(new AppError(`No Blog found with  ID ${req.params.id}`, 400));
  res.status(200).send(null);
});
exports.myBlogs = catchAsync(async (req, res, next) => {
  const blogs = await Blog.find({ user: req.user.id });
  res.status(200).json({
    status: "Success",
    blogs: blogs,
  });
});
