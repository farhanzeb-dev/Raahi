const userModel = require("../models/user.model");

// Create and save a user using the Mongoose model.
module.exports.registerUser = async ({ fullname, email, password }) => {
  // Ensure the main registration values were provided.
  // Detailed field validation is handled by the route and model.
  if (!fullname || !email || !password) {
    throw new Error("All fields are required");
  }

  // Save the new user in MongoDB and return the created document.
  const user = await userModel.create({ fullname, email, password });

  return user;
};