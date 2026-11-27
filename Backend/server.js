const http = require("http");
const app = require("./app");

// Express handles requests, and Node's HTTP server listens for them.
const server = http.createServer(app);

// Use the port from .env; if it is missing, use 3000.
const port = process.env.PORT || 3000;

// Start the server so it can receive browser or app requests.
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
