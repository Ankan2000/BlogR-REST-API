const User = require("../models/User");

const getUserById = (req, res, next, id) => {
  User.findById(id)
    .populate("address")
    .exec((err, user) => {
      if (err)
        return res.status(400).json({
          error: true,
          msg: `Error reading user with id = ${id}`,
          data: err,
        });

      if (!user)
        return res
          .status(404)
          .json({ error: true, msg: "User does not exist", data: err });

      user.salt = undefined;
      user.hashed_password = undefined;
      req.profile = user;
      next();
    });
};

module.exports = { getUserById };
