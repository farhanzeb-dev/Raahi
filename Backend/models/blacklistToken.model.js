const mongoose = require("mongoose");

// This collection remembers tokens that have been logged out.
const blacklistTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,

    // If logout does not provide a date, use the time this record is created.
    default: Date.now,

    // MongoDB removes the record after it has expired for 24 hours.
    // The auth middleware checks this collection before accepting a token.
    index: { expires: "24h" },
  },
});

// Create the model used to save and search blacklisted tokens.
module.exports = mongoose.model("BlacklistToken", blacklistTokenSchema);
