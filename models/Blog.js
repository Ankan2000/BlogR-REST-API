const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    privateBlog: {
      type: Boolean,
      default: false,
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    user: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    comments: [
      {
        type: ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);

const Blog = new mongoose.model("Blog", blogSchema);

module.exports = Blog;
