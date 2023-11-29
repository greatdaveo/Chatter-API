const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

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
    validate: {
      validator: function (val) {
        return val === this.password;
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

const UserModel = mongoose.model("UserCollection", UserSchema);

module.exports = UserModel;
