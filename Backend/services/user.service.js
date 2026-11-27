const userModel = require("../models/user.model");

// This service handles the database part of user registration.
// The controller handles the HTTP request and response.
module.exports.registerUser = async ({ fullname, email, password }) => {
  // Basic guard in case this service is called without these values.
  if (!fullname || !email || !password) {
    throw new Error("All fields are required");
  }

  // Create a user record in MongoDB and return the saved document.
  const user = await userModel.create({ fullname, email, password });

  return user;
};
