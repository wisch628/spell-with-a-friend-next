const client = require('../db');
const WebSocket = require('ws');  // Add this line


const calculatePoints = (word, isPangram) => {
      if (word.length === 4) {
        return 1;
      }
      points = word.length;
      if (isPangram) {
        return points + 7;
      }
      return points;
}

exports.addWord = async (req, res) => {
    const game_code = req.params.id
  const { word, color, isPangram } = req.body;

  if (!word || !color || !game_code) {
    return res.status(400).json({ error: 'missing required values' });
  }

  try {
 
    // Begin transaction
    await client.query('BEGIN');

    // Insert the new game into the games table
    const checkIfExists = `
      SELECT word
      FROM words
      WHERE word = $1
      and game_code = $2
    `;
    const wordExists = await client.query(checkIfExists, [word, game_code]);
    if (wordExists.rows.length > 0) {
      throw Error('That word already exists')
    }
    const points = calculatePoints(word, isPangram);

    const insertWordQuery = `
      INSERT INTO words (game_code, color, word, points)
      VALUES ($1, $2, $3, $4)
    `;
    await client.query(insertWordQuery, [game_code, color, word, points]);

    // Commit the transaction
    await client.query('COMMIT');
    const getUpdatedWords = `
      SELECT word, color, points
      FROM words
      WHERE game_code = $1
    `;
    const words = await client.query(getUpdatedWords, [game_code]);

    req.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          message: `A new word has been added`,
          words: words.rows,
          type: 'new_word'
        }));
      }
    });
    // Respond with the new game details
    res.status(201).json({
      message: 'Word added successfully',
      words: words.rows,
    });
  } catch (error) {
    // Rollback in case of error
    await client.query('ROLLBACK');
    console.error('Error adding word:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};