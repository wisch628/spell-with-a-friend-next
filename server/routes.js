// routes/gameRoutes.js
const express = require('express');
const router = express.Router();
const gameController = require('./controllers/gameController');
const wordsController = require('./controllers/wordsController');
const messagesController = require('./controllers/messagesController');



// Game Routes
router.post('/game/:id/user', gameController.createNewUser);     // Create new game
router.post('/game', gameController.createNewGame);     // Create new game
router.get('/todaysData', gameController.getTodaysData); // Get data
router.get('/game/:id', gameController.getGame); // Get game
router.post('/words/:id', wordsController.addWord); // Add word
router.get('/messages/:id', messagesController.getMessages); // Get chat messages
router.post('/messages/:id', messagesController.sendMessage); // Send message



module.exports = router;