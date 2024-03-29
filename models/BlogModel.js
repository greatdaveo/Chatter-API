const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blogSchema = new mongoose.Schema({
  blog_id: {
    type: String,
    required: true,
    unique: true,
  },

  title: {
    type: String,
    required: true,
  },

  banner: {
    type: String,
    // required: true,
  },

  description: {
    type: String,
    // required: true,
  },

  content: {
    type: [],
    // required: true,
  },

  tags: {
    type: [String],
    required: true,
  },

  author: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "users",
  },

  activity: {
    total_likes: {
      type: Number,
      default: 0,
    },

    total_comments: {
      type: Number,
      default: 0,
    },

    total_reads: {
      type: Number,
      default: 0,
    },
  },
});

const BlogModel = mongoose.model("Blog-Content", blogSchema);

module.exports = BlogModel;
