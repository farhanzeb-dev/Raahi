const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// A schema is the description of what a user record looks like in MongoDB.
const userSchema = new mongoose.Schema({
  fullname: {
    firstname: {
      type: String,
      required: true,
      minlength: [3, "Firstname must be at least 3 characters long"],
    },
    lastname: {
      type: String,
      minlength: [3, "Lastname must be at least 3 characters long"],
    },
  },
  email: {
    type: String,
    required: true,

    // MongoDB prevents two records from using the same email.
    // A duplicate email can still cause a database error when saving.
    unique: true,

    minlength: [5, "Email must be at least 5 characters long"],
  },
  password: {
    type: String,
    required: true,

    // Hide this field from normal database queries.
    // Login explicitly asks for it so comparePassword can check the hash.
    select: false,
  },
  socketId: {
    // Can hold a connection ID if the app later uses live socket updates.
    type: String,
  },
});

// A method on a user document that creates a signed login token.
// The token carries the user's database ID and is valid for 24 hours.
// JWT_SECRET is the secret key from .env used to sign and verify tokens.
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  }); // Token expires in 24 hours.

  return token;
};

// Check a user's typed password against the saved bcrypt hash.
// The typed password is not stored; bcrypt compares it to the hash.
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Turn a plain password into a bcrypt hash before saving the user.
// The number 10 controls bcrypt's hashing work factor.
userSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

// Create the User model, which provides database operations for user records.
const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
