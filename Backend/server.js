const http = require("http");
const app = require("./app");

// Create an HTTP server that uses the Express app.
const server = http.createServer(app);

// Use the PORT from .env, or 3000 if PORT is not set.
const port = process.env.PORT || 3000;

// Start accepting requests.
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});