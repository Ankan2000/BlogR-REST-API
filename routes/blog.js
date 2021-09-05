const router = require("express").Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const { isAuthenticated, isSignedIn } = require("../controllers/auth");
const {
  getBlogById,
  getBlog,
  createBlog,
  getAllBlogs,
  getAllPrivateBlogs,
  uploadImageToS3,
} = require("../controllers/blog");
const { getUserById } = require("../controllers/user");

router.param("blogId", getBlogById);
router.param("userId", getUserById);

router.get("/blog/:blogId", getBlog);

router.get("/blog/all/blogs", getAllBlogs);

router.get(
  "/blog/all/private/:userId",
  isSignedIn,
  isAuthenticated,
  getAllPrivateBlogs
);

router.post(
  "/create/blog/:userId",
  isSignedIn,
  isAuthenticated,
  upload.single("image"),
  uploadImageToS3,
  createBlog
);

module.exports = router;
