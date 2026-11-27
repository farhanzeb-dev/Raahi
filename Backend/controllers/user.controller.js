const userModel = require("../models/user.model");
const userService = require("../services/user.service");
const { validationResult } = require("express-validator");
const blacklistTokenModel = require("../models/blacklistToken.model");

// Registration: validate, hash the password, save the user, and issue a token.
module.exports.registerUser = async (req, res, next) => {
  // Read the validation results produced by the route's body(...) checks.
  const errors = validationResult(req);

  // Stop here if the request has invalid fields.
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // The frontend sends these values in the request body.
  const { fullname, email, password } = req.body;

  // Never save the original password; save its one-way hash instead.
  const hashedPassword = await userModel.hashPassword(password);

  // The service creates the MongoDB record using the hashed password.
  const user = await userService.registerUser({
    fullname,
    email,
    password: hashedPassword,
  });

  // Give the new user a signed token they can use for authenticated requests.
  const token = user.generateAuthToken();

  // Registration returns the token in JSON; it does not set a cookie here.
  // Check that the returned user object does not expose the password hash.
  res.status(201).json({
    message: "User registered successfully",
    user,
    token,
  });
};

// Login: find the account, compare passwords, then issue a token.
module.exports.loginUser = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  // The model hides passwords in normal queries.
  // "+password" specifically includes the saved hash for this comparison.
  const user = await userModel.findOne({ email }).select("+password");

  // Use one generic message so the response does not reveal which value failed.
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  // Compare the submitted password with the hash from MongoDB.
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  // Correct credentials: create a token and put it in a browser cookie.
  const token = user.generateAuthToken();
  res.cookie("token", token);

  // This user was loaded with its password hash.
  // The response currently includes user, so check that the hash is not sent.
  res.status(200).json({
    message: "Login successful",
    user,
    token,
  });
};

// The auth middleware sets req.user after it verifies the token.
// This handler simply returns that user as the profile.
module.exports.getUserProfile = async (req, res, next) => {
  res.status(200).json({
    message: "User profile retrieved successfully",
    user: req.user,
  });
};

// Logout: put this token on the blacklist so auth middleware rejects it.
module.exports.logoutUser = async (req, res, next) => {
  // The token may have arrived in the cookie or as "Bearer <token>".
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  // Save it to MongoDB; the blacklist model expires the record after 24 hours.
  await blacklistTokenModel.create({ token });

  // Remove the browser's cookie and tell the client logout succeeded.
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successful" });
};
