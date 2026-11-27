// Load values from the .env file into process.env.
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const userRoutes = require("./routes/user.routes");
const app = express();

// Parse form submissions and make their fields available in req.body.
app.use(express.urlencoded({ extended: true }));

const connectToDB = require("./db/db");

// Start connecting to MongoDB.
// This call does not wait for the connection before the server starts.
connectToDB();

const cors = require("cors");

// Parse JSON request bodies so routes can read req.body.
app.use(express.json());

// Mount user endpoints under /users.
// For example, the register endpoint becomes POST /users/register.
app.use("/users", userRoutes);

// CORS is registered after the user routes.
// Move this above app.use("/users", userRoutes) if browser-based
// frontends on another origin need to call those routes.
app.use(cors());

// A simple check that the API is responding.
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Export the app so server.js can start it.
module.exports = app;