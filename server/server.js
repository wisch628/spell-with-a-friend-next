const express = require('express');
const cors = require('cors'); // Import CORS
const app = express();
const routes = require('./routes');

// Enable CORS for all origins or specific origin
app.use(cors({
  origin: 'http://localhost:3000'  // Allow requests from frontend running on this port
}));
app.use(express.json()); // Middleware to parse JSON bodies
app.use('/', routes)


// Start the server
app.listen(8000, () => {
  console.log("Server is running on http://localhost:8000");
});