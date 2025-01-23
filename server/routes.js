// routes/gameRoutes.js
const express = require('express');
const router = express.Router();
const gameController = require('./controllers/gameController');
const wordsController = require('./controllers/wordsController');


// Game Routes
router.post('/game', gameController.createNewGame);     // Create new game
router.get('/todaysData', gameController.getTodaysData); // Get data
router.get('/game/:id', gameController.getGame); // Get game
router.post('/words/:id', wordsController.addWord); // Add word



module.exports = router;