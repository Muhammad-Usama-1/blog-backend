const express = require("express");
const globalErrorHandler = require("./controllers/errorController");
const blogRoutes = require("./routes/blogRoutes");
const userRoutes = require("./routes/userRoutes");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const app = express();
// app.use(helmet());
app.use(express.json());
app.use(cookieParser());

app.use("/blogs", blogRoutes);
app.use("/users", userRoutes);

app.use(globalErrorHandler);

module.exports = app;

// User update password
// forget password
// reset password
// choose one of two option send error carefuly means using mongoose error or validate req.body
// a
