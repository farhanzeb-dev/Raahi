const userModel = require("../models/user.model");
const userService = require("../services/user.service");
const { validationResult } = require("express-validator");

// Handle a new user registration request.
module.exports.registerUser = async (req, res, next) => {
  // Check the validation results created by user.routes.js.
  const errors = validationResult(req);

  // Return the validation messages if any fields are invalid.
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Get the registration details from the request body.
  const { fullname, email, password } = req.body;

  // Hash the password before saving it to the database.
  const hashedPassword = await userModel.hashPassword(password);

  // Ask the service to create and save the new user.
  const user = await userService.registerUser({
    fullname,
    email,
    password: hashedPassword,
  });

  // Create a JWT for the newly registered user.
  const token = user.generateAuthToken();

  // Return a created response with a message, user, and token.
  // Consider removing the password field before sending the user object.
  res.status(201).json({
    message: "User registered successfully",
    user,
    token,
  });
};