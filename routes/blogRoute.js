const express = require("express");
const {
  uploadURL,
  createPost,
  latestBlogs,
  trendingBlogs,
  searchBlogs,
} = require("../Controllers/blogController");
const verifyToken = require("../Middleware/verifyToken");

const router = express.Router();

// To upload the blog banner image url to AWS
router.get("/upload-url", uploadURL);
router.post("/create-blog", verifyToken, createPost);
router.get("/latest-blogs", latestBlogs);
router.get("/trending-blogs", trendingBlogs);
router.post("/search-blogs", searchBlogs);

module.exports = router;
