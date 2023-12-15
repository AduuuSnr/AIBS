const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    name: String,
    surname: String,
    email: String,
    username: String,
    password: String,
    role: String,
    token: String,
    create_date: String,
  },
  { versionKey: false }
);

module.exports = mongoose.model("Users", UserSchema);
