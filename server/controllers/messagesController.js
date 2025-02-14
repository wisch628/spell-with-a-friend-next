const client = require('../db');
const WebSocket = require('ws');  // Add this line

exports.sendMessage = async (req, res) => {
    const gameCode = req.params.id
  const { content, color } = req.body;

  if (!content || !color || !gameCode) {
    return res.status(400).json({ error: 'missing required values' });
  }

  try {
 
    // Begin transaction
    await client.query('BEGIN');

    const insertMessageQuery = `
      INSERT INTO messages (game_code, color, content)
      VALUES ($1, $2, $3)
    `;
    await client.query(insertMessageQuery, [gameCode, color, content]);

    // Commit the transaction
    await client.query('COMMIT');
    const getUpdatedMessages = `
      SELECT content, color, timestamp
      FROM messages
      WHERE game_code = $1
    `;
    const messages = await client.query(getUpdatedMessages, [gameCode]);

    req.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          message: `A new message has been sent`,
          messages: messages.rows,
          type: 'new_message'
        }));
      }
    });
    // Respond with the new game details
    res.status(201).json({
      message: 'Message added successfully',
      messages: messages.rows,
    });
  } catch (error) {
    // Rollback in case of error
    await client.query('ROLLBACK');
    console.error('Error adding message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getMessages = async (req, res) => {
  const gameCode = req.params.id

  try {

    // Begin transaction
    await client.query('BEGIN');

    // Insert the new game into the games table
    const selectMessages = `
      SELECT color, content, timestamp
      FROM messages
      WHERE game_code = $1
    `;
  
    const messages = await client.query(selectMessages, [game_code]);

    // Respond with the chat messages
    res.status(200).json({
      message: 'Message retrival successful',
      messages: messages.rows,
    });
  } catch (error) {
    // Rollback in case of error
    await client.query('ROLLBACK');
    console.error('Error getting messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};