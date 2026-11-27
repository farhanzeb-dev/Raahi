const userModel = require("../models/user.model");

// This import is in the provided code but is not used by this middleware.
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const blacklistTokenModel = require("../models/blacklistToken.model");

// This middleware protects profile and logout routes.
// It checks the request's token before allowing the route to continue.
module.exports.authUser = async (req, res, next) => {
  // Accept a token from the login cookie or an Authorization: Bearer header.
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    // This sends a response, but the code then continues below.
    // That means it can still try to look up and verify a missing token.
    res
      .status(401)
      .json({ message: "No token provided, authorization denied" });
  }

  // A logged-out token is stored in this collection and should be rejected.
  const isBlacklisted = await blacklistTokenModel.findOne({ token });

  if (isBlacklisted) {
    return res
      .status(401)
      .json({ message: "Token is blacklisted, authorization denied" });
  }

  try {
    // Verify signature and expiry. If invalid or expired, this throws an error.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Use the ID inside the token to load the account from MongoDB.
    const user = await userModel.findById(decoded._id);

    // Pass the account to the next handler through the request object.
    req.user = user;

    // Continue to the protected route only after token verification.
    return next();
  } catch (error) {
    // Invalid, expired, or unverifiable token: reject the request.
    res.status(401).json({ message: "Invalid token, authorization denied" });
  }
};
