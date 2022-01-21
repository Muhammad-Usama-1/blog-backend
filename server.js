const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const app = require("./app");

const port = process.env.PORT || 3001;
console.log(process.env.NODE_ENV);
mongoose
  .connect("mongodb://localhost:27017/project3")
  .then(() => console.log("DB conneceted"))
  .catch((err) => console.log("DB Failled on connecting", err));
app.listen(port, () => console.log(`"APP is Listening on port  ${port} `));
