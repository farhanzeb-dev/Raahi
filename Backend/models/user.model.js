const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Describe the fields stored for each user.
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

    // Mongoose uses this to create a uniqueness constraint in MongoDB.
    // Handle duplicate-email database errors in the API.
    unique: true,

    minlength: [5, "Email must be at least 5 characters long"],
  },
  password: {
    type: String,
    required: true,

    // Excludes the password from normal database query results.
    // Do not assume this also hides it when returning a newly created
    // user document; remove the password before sending the response.
    select: false,
  },
  socketId: {
    // Can store a user's socket connection ID for real-time features.
    type: String,
  },
});

// Create a JWT containing the user's database ID.
// JWT_SECRET should be set in the .env file.
// This token currently has no expiration time configured.
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
  return token;
};

// Compare a plain-text password with this user's stored password hash.
// A login feature could use this method.
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Hash a password using bcrypt with a cost factor of 10.
userSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

// Create the Mongoose model used to read and write user records.
const userModel = mongoose.model("user", userSchema);

module.exports = userModel;