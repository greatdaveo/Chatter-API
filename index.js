const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User");
const cookie = require("cookie");

const app = express();

// External libraries
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Replace with the actual origin of your React app
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // Enable credentials (cookies, authorization headers)
  })
);
app.use(express.json());
app.use(cookieParser());

// To hash password
const salt = bcrypt.genSaltSync(10);
const secret = "oiuhyjtfgret67389oi42jhegtr67tghwho8ghwqkkiu782eirf";

// JWT SECRET
const jwtSecret = "ywposd29eciode0928uf";

mongoose.connect(
  "mongodb+srv://CapstoneChatterBlog:DaveChatterBlog@cluster0.sn2xthk.mongodb.net/?retryWrites=true&w=majority"
);

// For Registration
app.post("/register", async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    selectedOption,
    password,
    confirmPassword,
  } = req.body;

  try {
    const userDoc = await User.create({
      firstName,
      lastName,
      email,
      selectedOption,
      password,
      confirmPassword,
    });
    // console.log(userDoc);
    res.json(userDoc);
  } catch (err) {
    res.status(400).json(err);
  }
});

// // For Login
// app.post("/login", async (req, res) => {
//   // console.log(req.body);
//   const { email, password } = req.body;
//   const userDoc = await User.findOne({ email });
//   const passOk = bcrypt.compareSync(password, userDoc.password);

//   if (passOk) {
//     jwt.sign({ email, id: userDoc._id }, secret, (err, token) => {
//       if (err) throw err;
//       res.cookie("token", token).json({
//         id: userDoc._id,
//         email,
//       });
//     });
//   } else {
//     res.status(400).json("Wrong Credentials");
//   }
// });

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // To provide the user with the provided email
    const userEmail = await User.findOne({ email });

    if (!userEmail) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    // To compare the password with the stored password hash
    const isPasswordValid = await userEmail.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid Password" });
    }

    // To generate JWT Token
    const token = jwt.sign({ id: user._id }, jwtSecret, {});
    // To send a success response with the token
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// ...

// app.post("/logout", (req, res) => {
//   // Clear the token cookie
//   res.clearCookie("token").json("ok");
// });

// app.get("/profile", (req, res) => {
//   const { token } = req.cookies;
//   jwt.verify(token, secret, (err, info) => {
//     if (err) throw err;
//     res.json(info);
//   });
// });

app.post("/logout", (req, res) => {
  res.cookies("token", "").json("ok");
});

const port = 4000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

//
// ChatterBlog
