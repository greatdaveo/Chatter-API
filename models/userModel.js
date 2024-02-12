const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  selectedOption: { type: String },
  email: {
    required: true,
    type: String,
    unique: true,
    lowercase: true,
    match: /^\S+@\S+\.\S+$/,
  },
  password: { type: String, required: true, minlength: 5 },
  confirmPassword: {
    type: String,
    required: true,
    minlength: 5,
    select: false,
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: "Passwords do not match! Please try again.",
    },
  },
});

const UserModel = mongoose.model("Users", UserSchema);

module.exports = UserModel;
