const mongoose = require("mongoose");
const { Schema, model } = mongoose;
// const bcrypt = require("bcrypt");

const UserSchema = new Schema({
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
    validate: {
      validator: function (value) {
        return value === this.password;
      },
      message: "Passwords do not match",
    },
  },
});

// // Define the comparePassword method
// Schema.methods.comparePassword = async function (candidatePassword) {
//   try {
//     // Use bcrypt to compare the provided password with the stored hash
//     return await bcrypt.compare(candidatePassword, this.password);
//   } catch (error) {
//     throw error;
//   }

const UserModel = model("User", UserSchema);

module.exports = UserModel;
