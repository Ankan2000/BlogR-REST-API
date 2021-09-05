require("dotenv").config();
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const { validationResult } = require("express-validator");
const User = require("../models/User");

//* The keys are 1024bit encrypted
const privateKey = fs.readFileSync(path.resolve("private.pem"));
const publicKey = fs.readFileSync(path.resolve("public.pem"));

const signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    error: false,
    msg: "User is signed out!",
    data: null,
  });
};

const signup = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res
      .status(400)
      .json({ error: true, msg: "Validation failed", data: errors.array() });

  const user = new User(req.body);
  user.save((err, user) => {
    if (err)
      return res.status(400).json({
        error: true,
        msg: "Can not save User to Database!",
        data: err,
      });

    res.json({
      error: false,
      msg: "Success!",
      data: {
        id: user._id,
        name: user.fullName,
        email: user.email,
      },
    });
  });
};

const signin = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res
      .status(400)
      .json({ error: true, msg: "Validation failed", data: errors.array() });

  User.findOne({ email: req.body.email }, function (err, user) {
    if (err)
      return res
        .status(400)
        .json({ error: true, msg: "Error reading e-mail", data: null });
    if (!user)
      return res.status(400).json({
        error: true,
        msg: "No user found with this email!",
        data: null,
      });
    if (!user.authenticate(req.body.password))
      return res.status(401).json({
        error: true,
        msg: "E-mail and password do not match",
        data: null,
      });

    const token = jwt.sign({ id: user._id }, privateKey, {
      algorithm: "RS256",
    });

    res.cookie("token", token, { expire: new Date() + 2160 });

    const { _id, fullName, email, privilege } = user;
    res.json({
      error: false,
      msg: "Success!",
      data: { token, user: { _id, name: fullName, email, privilege } },
    });
  });
};

const isSignedIn = expressJwt({
  secret: publicKey,
  userProperty: "auth",
  algorithms: ["RS256"],
});

const isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id.equals(req.auth.id);
  if (!checker)
    return res
      .status(403)
      .json({ error: true, msg: "ACCESS DENIED", data: null });
  next();
};

module.exports = {
  signout,
  signup,
  signin,
  isSignedIn,
  isAuthenticated,
};
