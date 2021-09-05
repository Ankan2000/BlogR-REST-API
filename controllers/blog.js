require("dotenv").config();
const AWS = require("aws-sdk");
const Blog = require("../models/Blog");
const { v4: uuidv4 } = require("uuid");

const getBlogById = (req, res, next, id) => {
  return Blog.findById(id)
    .populate("user", "_id name email")
    .then((blog) => {
      if (!blog)
        return res
          .status(404)
          .json({ error: true, msg: "Blog NOT FOUND", data: blog });
      req.blog = blog;
      next();
    })
    .catch((err) =>
      res
        .status(500)
        .json({ error: true, msg: "Error reading Blog", data: err })
    );
};

const uploadImageToS3 = (req, res, next) => {
  if (req.file) {
    s3 = new AWS.S3({ apiVersion: "2006-03-01" });
    const params = {
      Bucket: "blogr-round3",
      Key: req.file.fieldname + uuidv4(),
      Body: req.file.buffer,
      ACL: "public-read",
      ContentType: req.file.mimetype,
      ContentEncoding: "base64",
    };
    return s3.upload(params, (err, data) => {
      if (err)
        return res
          .status(400)
          .json({ error: true, msg: "Can't upload file", data: err });
      req.image = data.Location;
      next();
    });
  }
  next();
};

const getBlog = (req, res) =>
  res.json({ error: false, msg: "Success", data: req.blog });

const getAllPrivateBlogs = (req, res) => {
  return Blog.find({ user: req.profile._id, privateBlog: true })
    .populate("user", "_id name email")
    .then((blogs) => {
      if (!blogs || !blogs.length)
        return res
          .status(404)
          .json({ error: true, msg: "No blogs found", data: blogs });

      return res.json({ error: false, msg: "Success", data: blogs });
    })
    .catch((err) =>
      res
        .status(500)
        .json({ error: true, msg: "Error reading Blogs", data: err })
    );
};

const getAllBlogs = (req, res) => {
  return Blog.find({ privateBlog: false })
    .populate("user", "_id name email")
    .then((blogs) => {
      if (!blogs || !blogs.length)
        return res
          .status(404)
          .json({ error: true, msg: "No blogs found", data: blogs });

      return res.json({
        error: false,
        msg: "Success",
        data: blogs,
      });
    })
    .catch((err) =>
      res
        .status(500)
        .json({ error: true, msg: "Error reading Blogs", data: err })
    );
};

const createBlog = (req, res) => {
  const blog = new Blog(req.body);
  blog.image = req.image;
  return blog
    .save()
    .then((blog) => {
      return res.json({ error: false, msg: "Succesfull", data: blog });
    })
    .catch((err) =>
      res.status(500).json({ error: true, msg: "Can not save Blog", data: err })
    );
};

module.exports = {
  getBlogById,
  getBlog,
  uploadImageToS3,
  getAllBlogs,
  getAllPrivateBlogs,
  createBlog,
};
