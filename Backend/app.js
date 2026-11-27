// Read settings from .env and place them in process.env.
// Other files use these settings for the port, database connection, and JWT signing.
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const userRoutes = require("./routes/user.routes");
const cookieParser = require("cookie-parser");
const app = express();

// Middleware prepares incoming request data before it reaches a route.
// This parser handles form submissions, such as fullname.firstname=Sara.
app.use(express.urlencoded({ extended: true }));

const connectToDB = require("./db/db");

// Begin connecting to MongoDB when this app is loaded.
// This starts the connection but does not wait for it to finish.
connectToDB();

const cors = require("cors");

// Parse JSON request bodies, so route code can read values from req.body.
app.use(express.json());

// Parse cookies from incoming requests, so auth middleware can read req.cookies.
app.use(cookieParser());

// All routes in user.routes.js get the /users prefix.
// Example: its /login route becomes /users/login.
app.use("/users", userRoutes);

// CORS lets browser pages from other origins call this API.
// Since this comes after /users, it may not apply to requests handled by those routes.
app.use(cors());

// A basic route for checking that the server responds.
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Export the configured app; server.js creates the HTTP server around it.
module.exports = app;
