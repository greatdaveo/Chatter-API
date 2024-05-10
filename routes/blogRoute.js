const express = require("express");
const { uploadURL, createPost } = require("../Controllers/blogController");
const verifyToken = require("../Middleware/verifyToken");

const router = express.Router();

// To upload the blog banner image url to AWS
router.get("/upload-url", uploadURL);
router.post("/create-blog", verifyToken, createPost);

module.exports = router;
