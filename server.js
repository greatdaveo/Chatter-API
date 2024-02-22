const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const UserModel = require("./models/UserModel");
const aws = require("aws-sdk");

const dotenv = require("dotenv");
dotenv.config();
const cookieParser = require("cookie-parser");
// To handle cookies
const jwt = require("jsonwebtoken");
// FOR THE PASSWORD ENCRYPTION
const bcrypt = require("bcryptjs");
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);
// MongoDB Connection
mongoose.connect(process.env.MongoDB_CONN_STR, { autoIndex: true });
// AWS S3 Bucket Connection
const s3 = new aws.S3({
  region: "eu-west-2",
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// To set the blog banner image url name
const generateFileUrl = async () => {
  const date = new Date();
  const imageName = `photo-${date.getTime()}.jpeg`;

  return await s3.getSignedUrlPromise("putObject", {
    Bucket: "chatter-blog-bucket-name",
    Key: imageName,
    Expires: 10000,
    ContentType: "image/jpeg",
  });
};

// To upload the blog banner image url to AWS
app.get("/upload-url", (req, res) => {
  generateFileUrl()
    .then((url) => res.status(200).json({ uploadUrl: url }))
    .catch((err) => {
      console.log(err.message);
      return res.status(500).json({ error: err.message });
    });
});

// FOR REGISTRATION
app.post("/register", async (req, res) => {
  const {
    firstName,
    lastName,
    selectOption,
    email,
    password,
    confirmPassword,
  } = req.body;

  try {
    const oldUser = await UserModel.findOne({ email });
    if (oldUser) {
      res.status(401).json("User exist, kindly login!");
      return;
    }

    if (password !== confirmPassword) {
      res.status(401).json("Passwords do not match!");
      return;
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = new UserModel({
      firstName,
      lastName,
      selectOption,
      email,
      password: hashedPassword,
      confirmPassword: hashedPassword,
    });

    await newUser.save();
    // console.log(newUser);

    res.status(201).json("You have just created an account!");
  } catch (err) {
    res.status(401).json("Please fill all required details!");
    // console.log(err.message);
  }
});

// FOR LOGIN
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const userDoc = await UserModel.findOne({ email });
    if (!userDoc) {
      res.status(400).json("User doesn't exist!");
    }

    const validPassword = bcrypt.compareSync(password, userDoc.password);
    if (!validPassword) {
      res.status(400).json("Incorrect email or password!");
    }

    // To handle cookie
    const token = jwt.sign({ email, id: userDoc._id }, process.env.JWT_SECRET);
    // To send user data except the password to the client for security reasons
    const { password: passwd, ...otherUserInfo } = userDoc._doc;
    res.cookie("access_token", token).status(200).json(otherUserInfo);
  } catch (error) {
    console.log(error);
  }
});

const port = 4000;

app.get("/test", (req, res) => {
  res.json("Server testing is running!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
