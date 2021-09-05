const { isSignedIn, isAuthenticated } = require("../controllers/auth");
const { getAllComments, createComment } = require("../controllers/comment");
const { getUserById } = require("../controllers/user");
const { getBlogById } = require("../controllers/blog");
const router = require("express").Router();

router.param("userId", getUserById);
router.param("blogId", getBlogById);

router.get("/comment/all/:blogId", getAllComments);

router.post(
  "/create/comment/:userId/:blogId",
  isSignedIn,
  isAuthenticated,
  createComment
);

module.exports = router;
