// const UserModel = require("../models/userModel");
// const mongoose = require("mongoose");
// const jwt = require("jsonwebtoken");

// const signToken = (id) => {
//   return jwt.sign({ id }, process.env.SECRET_STR, {
//     expiresIn: process.nextTick.LOGIN_EXPIRES,
//   });
// };

// exports.signup = async (req, res) => {
//   const {
//     firstName,
//     lastName,
//     email,
//     selectedOption,
//     password,
//     confirmPassword,
//   } = req.body;
//   try {
//     const newUser = await UserModel.create({
//       firstName,
//       lastName,
//       email,
//       selectedOption,
//       password,
//       confirmPassword,
//     });
//     // const token = signToken(newUser._id);
//     res.json(newUser);
//     // res.status(201).json({
//     //   status: "success",
//     //   data: {
//     //     user: newUser,
//     //   },
//     // });
//   } catch (err) {
//     res.status(400).json({
//       data: {
//         status: "fail",
//         message: err.message,
//       },
//     });
//   }
// };
