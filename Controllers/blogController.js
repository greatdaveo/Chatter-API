const BlogModel = require("../models/BlogModel");
const UserModel = require("../models/UserModel");
const aws = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
// To generate a unique ID
const uniqueId = uuidv4();

// To upload the blog banner image url to AWS
const uploadURL = (req, res) => {
  generateFileUrl()
    .then((url) => res.status(200).json({ uploadUrl: url }))
    .catch((err) => {
      console.log(err.message);
      return res.status(500).json({ error: err.message });
    });
};

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

// To Create a Blog Post
const createPost = async (req, res) => {
  // The req.user is from the verifyToken Middleware and it will be used when the blog is to be published
  let authorId = req.user;
  // console.log(authorId)
  let { title, description, banner, tags, content, draft } = req.body;

  if (!title.length) {
    return res
      .status(403)
      .json({ error: "Please provide a title to publish the blog post" });
  }

  // To handle draft submission
  if (!draft) {
    if (!description.length || description.length > 200) {
      return res.status(403).json({
        error: "Please ensure blog description is not more than 200 characters",
      });
    }

    if (!banner.length) {
      return res
        .status(403)
        .json({ error: "Please provide blog banner to publish it!" });
    }

    if (!content.blocks.length) {
      return res
        .status(403)
        .json({ error: "Please provide a blog content to publish!" });
    }

    if (!tags.length || tags.length > 10) {
      return res.status(403).json({
        error: "Please provide tags with maximum of 10 to publish!",
      });
    }
  }

  // To convert each tag to lower case to make it easy to be searched for
  tags = tags.map((tag) => tag.toLowerCase());

  // To set a blogId
  let blogId =
    title
      .replace(/[^a-zA-Z0-9]/g, " ")
      .replace(/\s+/g, "-")
      .trim() + uniqueId;
  // console.log(blogId);

  // To save the blog post the database
  let createdBlogPost = new BlogModel({
    title,
    description,
    banner,
    tags,
    content,
    draft: Boolean(draft),
    author: authorId,
    blog_id: blogId,
  });

  // To store the data in the database
  createdBlogPost
    .save()
    .then((blogPost) => {
      // To set the incrementVal to update the number of post the user has created
      let incrementVal = draft ? 0 : 1;

      UserModel.findOneAndUpdate(
        { _id: authorId },
        {
          $inc: { "accountInfo.total_posts": incrementVal },
          $push: { blogs: blogPost._id },
        }
      )
        .then((user) => {
          return res.status(200).json({ id: blogPost.blog_id });
        })
        .catch((err) => {
          return res
            .status(500)
            .json({ error: "Failed to update total posts number!" });
        });
    })
    .catch((err) => {
      return res.status(500).json({ error: err });
    });
};

// To Get The Latest Blog Post
const latestBlogs = async (req, res) => {
  let maxLimit = 5;

  try {
    // I want all blogs, except a drafted blog
    const latestBlogData = await BlogModel.find({ draft: false })
      .populate("author", "firstName lastName -_id")
      .sort({ publishedAt: -1 })
      .select("blog_id title description banner activity tags publishedAt -_id")
      .limit(maxLimit)
      .catch((err) => {
        console.log("Latest Blog Data Error:", err);
      });

    if (!latestBlogData || latestBlogData.length === 0) {
      // console.log("No latest blog data found.");
    } else {
      // console.log("Latest Blog Data:", latestBlogData);
    }

    return res.status(200).json(latestBlogData);
  } catch (err) {
    console.error("Latest Blog Data Error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// To Get the Trending Blogs
const trendingBlogs = async (req, res) => {
  try {
    const trendingBlogData = await BlogModel.find({ draft: false })
      .populate("author", "firstName lastName -_id")
      .sort({
        "activity.total_read": -1,
        "activity.total_likes": -1,
        publishedAt: -1,
      })
      .select("blog_id title, publishedat -_id")
      .limit(5);

    if (!trendingBlogData || trendingBlogData.length === 0) {
      console.log("No trending blog data found.");
    } else {
      console.log("Latest Blog Data:", trendingBlogData);
    }

    return res.status(200).json(trendingBlogData);
  } catch (err) {
    console.log("Trending Data Error:", err);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { uploadURL, createPost, latestBlogs, trendingBlogs };
