const UserModel = require("../models/UserModel");
// To handle cookies
const jwt = require("jsonwebtoken");
// To Encrypt passwrod
const bcrypt = require("bcryptjs");

// FOR REGISTRATION
const registerUser = async (req, res) => {
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
};

// FOR LOGIN
const loginUser = async (req, res) => {
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
    // console.log(token);
    // To send user data except the password to the client for security reasons
    const { password: passwd, ...otherUserInfo } = userDoc._doc;
    res
      .cookie("access_token", token)
      .status(200)
      .json({ user: otherUserInfo, token });
    // res.json(token);
  } catch (error) {
    console.log(error);
  }
};

// To HANDLE USER COOKIEs
const userCookiesProfile = (req, res) => {
  const { access_token } = req.cookies;
  // console.log(access_token);
  // const decodedPayload = jwt.decode(access_token);
  // console.log(decodedPayload);

  if (access_token) {
    jwt.verify(
      access_token,
      process.env.JWT_SECRET,
      {},
      async (err, cookieData) => {
        if (err) throw err;
        const { name, email, _id } = await UserModel.findById(cookieData.id);
        res.json({ name, email, _id });
      }
    );
  } else {
    res.json(null);
  }
};

module.exports = { registerUser, loginUser, userCookiesProfile };
