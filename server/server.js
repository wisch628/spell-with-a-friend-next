const express = require('express');
const cors = require('cors');
const http = require('http');
const createWebSocketServer = require('./websocket');
const app = express();

// Set up CORS and Express
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Create HTTP server for Express
const server = http.createServer(app);

// Initialize WebSocket server
const wss = createWebSocketServer(server);

// Routes (import routes after WebSocket server is created)
const routes = require('./routes');

// Pass the WebSocket server to routes
app.use('/', (req, res, next) => {
  req.wss = wss; // Attach the WebSocket server to the request object
  next();
}, routes);

// Start the server
server.listen(8000, () => {
  console.log('Server running on http://localhost:8000');
});

module.exports = { app, wss }; // Export if needed