const express = require("express");
const {
  registerUser,
  loginUser,
  userCookiesProfile,
} = require("../Controllers/userControllers");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
// To HANDLE USER COOKIEs
router.get("/profile", userCookiesProfile);

module.exports = router;
