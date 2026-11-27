const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const userController = require("../controllers/user.controller");

// Define POST /users/register.
// app.js mounts this router at /users.
router.post(
  "/register",
  [
    // Require a first name with at least 3 characters.
    body("fullname.firstname")
      .isLength({ min: 3 })
      .withMessage("Firstname must be at least 3 characters long"),

    // Last name is optional, but must have at least 3 characters
    // if the request includes it.
    body("fullname.lastname")
      .optional()
      .isLength({ min: 3 })
      .withMessage("Lastname must be at least 3 characters long"),

    // Check that email has a valid email format.
    body("email")
      .isEmail()
      .withMessage("Invalid email address"),

    // Require a password with at least 6 characters.
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],

  // If validation passes, hand the request to the controller.
  userController.registerUser
);

router.post("/login", [
  body("email")
    .isEmail()
    .withMessage("Invalid email address"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
], userController.loginUser);

module.exports = router;