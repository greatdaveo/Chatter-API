const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: false }, // To make lastName optional for Google user
    selectedOption: { type: String, default: "reader" },
    email: {
      required: true,
      type: String,
      unique: true,
      lowercase: true,
      match: /^\S+@\S+\.\S+$/,
    },
    password: {
      type: String,
      required: function () {
        return !this.google_auth; //Only required if not Google auth
      },
      minlength: 5,
    },
    confirmPassword: {
      type: String,
      required: function () {
        !this.google_auth;
      },
      minlength: 5,
      select: false,
      validate: {
        validator: function (val) {
          return val === this.password;
        },
        message: "Passwords do not match! Please try again.",
      },
    },

    accountInfo: {
      total_posts: {
        type: Number,
        default: 0,
      },
      total_reads: {
        type: Number,
        default: 0,
      },
    },

    google_auth: {
      type: Boolean,
      default: false,
    },

    blogs: {
      type: [Schema.Types.ObjectId],
      ref: "blogs",
      default: [],
    },
  },

  { timestamps: true }
);

const UserModel = mongoose.model("Users", UserSchema);

module.exports = UserModel;
