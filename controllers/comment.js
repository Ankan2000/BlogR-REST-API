const Comment = require("../models/Comment");

const getAllComments = (req, res) => {
  return Comment.find({ blog: req.blog._id })
    .populate("user", "_id name email")
    .then((comments) => {
      if (!comments)
        return res
          .status(404)
          .json({ error: true, msg: "No commments till now", data: comments });
      return res.json({ error: false, msg: "Success", data: comments });
    });
};

const createComment = (req, res) => {
  const comment = new Comment(req.body);
  comment.user = req.profile._id;
  comment.blog = req.blog._id;

  return comment
    .save()
    .then((comment) => {
      return res.json({ error: false, msg: "Succesfull", data: comment });
    })
    .catch((err) =>
      res
        .status(500)
        .json({ error: true, msg: "Can not save Comment", data: err })
    );
};

module.exports = {
  getAllComments,
  createComment,
};
