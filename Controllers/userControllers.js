const UserModel = require("../models/UserModel");
// To handle cookies
const jwt = require("jsonwebtoken");
// To Encrypt password
const bcrypt = require("bcryptjs");
// For Firebase Auth
const { getAuth } = require("firebase-admin/auth");
// FOR GOOGLE AUTH
const googleAuth = async (req, res) => {
  let { access_token } = req.body;
  console.log("Received Token:", access_token);

  if (!access_token) {
    return res.status(400).json({ error: "Access token is required" });
  }

  try {
    const decodedUser = await getAuth().verifyIdToken(access_token);
    const { email, name } = decodedUser;

    let userDoc = await UserModel.findOne({ email })
      .select("firstName lastName google_auth")
      .catch((err) => {
        throw new Error(err.message);
      });

    if (userDoc) {
      if (!userDoc.google_auth) {
        // Login
        return res.status(403).json({
          error:
            "This email was signed up with google. Please log in with password to access the account!",
        });
      }
    } else {
      // Sign up if user is new
      userDoc = new UserModel({
        firstName: name,
        email,
        google_auth: true,
      });

      userDoc = await userDoc.save().catch((err) => {
        throw new Error(err.message);
      });
    }

    // To handle cookie
    const token = jwt.sign({ email, id: userDoc._id }, process.env.JWT_SECRET);
    // console.log(token);

    return res.cookie("access_token", token).status(200).json(userDoc);
  } catch (err) {
    console.error("Error verifying token:", err.message);
    return res.status(500).json({
      error: "Failed to authenticate you with Google, please try again!",
    });
  }
};

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

// FOR LOGOUT
const logoutUser = async (req, res) => {
  res.cookie("access_token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "You have logged out successfully!" });
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

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  userCookiesProfile,
  googleAuth,
};
