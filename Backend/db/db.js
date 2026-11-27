// Mongoose is used to connect to and work with MongoDB.
// consistently, so the spelling itself does not break this code.
const mongoose = require("mongoose");

function connectDB() {
  // MONGODB_URI should be set in the .env file.
  mongoose
    .connect(process.env.MONGODB_URI, {})
    .then(() => {
      console.log("MongoDB connected");
    })
    .catch((err) => {
      // Stop the application if the database connection fails.
      console.log(err);
      process.exit(1);
    });
}

// Export the function so app.js can start the connection.
module.exports = connectDB;