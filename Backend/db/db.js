const mongoose = require("mongoose");

function connectDB() {
  // Mongoose uses this connection string to find the MongoDB database.
  // MONGODB_URI must be set in .env.
  mongoose
    .connect(process.env.MONGODB_URI, {})
    .then(() => {
      // This runs only after MongoDB accepts the connection.
      console.log("MongoDB connected");
    })
    .catch((err) => {
      // If the database cannot be reached, log the reason and stop the app.
      console.log(err);
      process.exit(1);
    });
}

// app.js calls this function to begin the database connection.
module.exports = connectDB;
