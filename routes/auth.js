const express = require("express");
const router = express.Router();
const { signout, signup, signin } = require("../controllers/auth");
const User = require("../models/User");
const { check } = require("express-validator");

//* signup *
router.post(
  "/signup",
  check("name.first")
    .not()
    .isEmpty()
    .withMessage("firstname must not be empty")
    .isLength({ min: 3, max: 32 })
    .withMessage("firstname must be atleast 3 characters")
    .trim(),
  check("email")
    .isEmail()
    .withMessage("email should be valid")
    .normalizeEmail()
    .custom((email) => {
      return User.findOne({ email }).then((user) => {
        if (user) return Promise.reject("E-mail already in use");
      });
    })
    .withMessage("Email already in use"),
  check("password")
    .isStrongPassword()
    .withMessage(
      "password should not contain '@' and atleast 8 characters long"
    ),
  signup
);

//* signin *
router.post(
  "/signin",
  check("email")
    .isEmail()
    .withMessage("email should be valid")
    .normalizeEmail(),
  check("password")
    .isStrongPassword()
    .withMessage(
      "password is not strong or contain '@' or less than 8 characters"
    ),
  signin
);

//* signout *
router.get("/signout", signout);

module.exports = router;
