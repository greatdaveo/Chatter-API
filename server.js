const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const UserModel = require("./models/userModel");

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

mongoose.connect(
  "mongodb+srv://CapstoneChatterBlog:DaveChatterBlog@cluster0.sn2xthk.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// FOR REGISTRATION
app.post("/register", async (req, res) => {
  try {
    const userDoc = await UserModel.create(req.body);
    // console.log(userDoc);
    res.json(userDoc);
  } catch (err) {
    res.status(400).json(err);
  }
});

// FOR LOGIN
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  await UserModel.findOne({ email });
  if (req.body.password) {
    if (req.body.password === password) {
      res.json("Login Successful!");
    } else {
      res.json("The Password is incorrect!!!");
    }
  } else {
    res.json("This User Does not Exist!!!");
  }
});

const port = 4000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

//
// ChatterBlog
