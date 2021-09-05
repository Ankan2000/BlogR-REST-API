const mongoose = require("mongoose");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
const { ObjectId } = mongoose.Types;

const userSchema = new mongoose.Schema(
  {
    name: {
      first: {
        type: String,
        maxlength: 32,
        required: true,
        trim: true,
      },
      last: {
        type: String,
        maxlength: 32,
        trim: true,
      },
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    hashed_password: {
      type: String,
      required: true,
    },
    salt: String,
  },
  { timestamps: true }
);

userSchema
  .virtual("fullName")
  .get(function () {
    return this.name.first + " " + (this.name.last ? this.name.last : "");
  })
  .set(function (fullName) {
    this.name.first = fullName.substr(0, fullName.indexOf(" "));
    this.name.last = fullName.substr(fullName.lastIndexOf(" ") + 1);
  });

userSchema
  .virtual("password")
  .set(function (pass) {
    this._password = pass;
    this.salt = uuidv4();
    this.hashed_password = this.hashPassword(pass);
  })
  .get(function () {
    return this._password;
  });

userSchema.methods = {
  hashPassword: function (plainPassword) {
    if (!plainPassword) return "";
    try {
      return crypto
        .createHmac("sha256", this.salt)
        .update(plainPassword)
        .digest("hex");
    } catch (error) {
      return "";
    }
  },
  authenticate: function (plainPassword) {
    return this.hashPassword(plainPassword) === this.hashed_password;
  },
};

const User = new mongoose.model("User", userSchema);

module.exports = User;
