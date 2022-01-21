const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  name: {
    type: String,
  },
  password: {
    type: String,
    required: true,
    minlength: [6, "Too few password character"],
  },
});
userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
userSchema.methods.correctPassword = function (candidatePassword, DBPassword) {
  return bcrypt.compare(candidatePassword, DBPassword);
};
const User = mongoose.model("user", userSchema);
module.exports = User;
