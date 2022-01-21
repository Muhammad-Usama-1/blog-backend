const express = require("express");
const { protect } = require("../controllers/authControllers");
const {
  getAllBlogs,
  createBlog,
  deleteBlog,
  getBlog,
  updateBlog,
  myBlogs,
  uploadBlogPhoto,
} = require("../controllers/blogControllers");

const blogRoutes = express.Router();
blogRoutes.get("/my-blogs", protect, myBlogs);
blogRoutes
  .route("/")
  .get(getAllBlogs)
  .post(protect, uploadBlogPhoto, createBlog);
blogRoutes
  .route("/:id")
  .delete(protect, deleteBlog)
  .get(getBlog)
  .patch(updateBlog);
module.exports = blogRoutes;
