const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// This router's paths receive the /users prefix from app.js.
// So this endpoint is POST /users/register.
router.post(
  "/register",
  [
    // Check the first name before the controller tries to save the user.
    body("fullname.firstname")
      .isLength({ min: 3 })
      .withMessage("Firstname must be at least 3 characters long"),

    // The last name may be omitted. If present, it must have 3+ characters.
    body("fullname.lastname")
      .optional()
      .isLength({ min: 3 })
      .withMessage("Lastname must be at least 3 characters long"),

    // Reject a value that does not look like an email address.
    body("email").isEmail().withMessage("Invalid email address"),

    // Reject short passwords before hashing or saving them.
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],

  // If validation passes, the controller performs registration.
  userController.registerUser,
);

// This is POST /users/login.
// It checks input format first, then lets the controller check credentials.
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email address"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  userController.loginUser,
);

// These two routes run authUser before the controller.
// The middleware checks the token and attaches the matching user to req.user.
router.get("/profile", authMiddleware.authUser, userController.getUserProfile);

router.post("/logout", authMiddleware.authUser, userController.logoutUser);

module.exports = router;
