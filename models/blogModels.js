const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  category: {
    type: String,
    required: [true, "category is required for blog"],
    enum: [
      "Technology",
      "AI",
      "ML",
      "WEB3",
      "Software ENgineering",
      "blockchain",
      "crypto",
    ],
  },
  description: {
    type: String,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
  },
});
blogSchema.pre("find", function () {
  this.populate({
    path: "user",
    select: "-__v",
  });
});
const Blog = mongoose.model("model", blogSchema);
module.exports = Blog;
