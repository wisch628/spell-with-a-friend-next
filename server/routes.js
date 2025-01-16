// routes/gameRoutes.js
const express = require('express');
const router = express.Router();
const gameController = require('./controllers/gameController');

// Game Routes
router.post('/game', gameController.createNewGame);     // Create new game
router.get('/todaysData', gameController.getTodaysData); // Get data

module.exports = router;