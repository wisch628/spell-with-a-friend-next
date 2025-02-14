// routes/gameRoutes.js
const express = require('express');
const router = express.Router();
const wordsController = require('./controllers/wordsController');



// Game Routes
router.post('/words/:id', wordsController.addWord); // Add word



module.exports = router;