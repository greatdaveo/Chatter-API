const express = require("express");
const {
  registerUser,
  loginUser,
  userCookiesProfile,
  googleAuth,
  logoutUser,
} = require("../Controllers/userControllers");

const router = express.Router();

router.post("/google-auth", googleAuth);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// To HANDLE USER COOKIEs
router.get("/profile", userCookiesProfile);

module.exports = router;
