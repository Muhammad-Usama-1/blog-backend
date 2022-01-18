const express = require("express");
const { protect } = require("../controllers/authControllers");
const {
  getAllBlogs,
  createBlog,
  deleteBlog,
  getBlog,
  updateBlog,
} = require("../controllers/blogControllers");

const blogRoutes = express.Router();

blogRoutes.route("/").get(getAllBlogs).post(protect, createBlog);
blogRoutes
  .route("/:id")
  .delete(protect, deleteBlog)
  .get(getBlog)
  .patch(updateBlog);
module.exports = blogRoutes;
