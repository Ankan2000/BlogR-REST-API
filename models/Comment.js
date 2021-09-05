const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    user: {
      type: ObjectId,
      ref: "User",
    },
    blog: {
      type: ObjectId,
      ref: "Blog",
    },
  },
  { timestamps: true }
);

const Comment = new mongoose.model("Comment", commentSchema);

module.exports = Comment;
