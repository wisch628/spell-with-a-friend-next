const puppeteer = require('puppeteer');
const client = require('../db');
const WebSocket = require('ws');  // Add this line

const addUser = async (display_name, color, game_code) => {
 const insertUserGameQuery = `
      INSERT INTO game_users (game_code, display_name, color)
      VALUES ($1, $2, $3)
    `;
    await client.query(insertUserGameQuery, [game_code, display_name, color]);

    // Commit the transaction
    await client.query('COMMIT');
}

const getRelevantDate = () => {
  const today = new Date()
  const cutoffTime = new Date(today);
  cutoffTime.setUTCHours(8, 0, 0, 0); // Set to 08:00:00 UTC

  if (today < cutoffTime) {
    // If before 8 AM UTC, return the previous day
    today.setUTCDate(today.getUTCDate() - 1);
  }

  return today.toISOString().split("T")[0]; // Return YYYY-MM-DD format
};

let cachedDailyData = {}; 

exports.getTodaysData = async (_, res) => {
  try {
    const today = getRelevantDate()
    if (cachedDailyData[today]) {
      res.json(cachedDailyData[today])
      return
    }
       // Launch the browser
    const browser = await puppeteer.launch({
      headless: true, // Set to 'false' to see the browser window
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    // Create a new page
    const page = await browser.newPage();

    // Go to the webpage you want to scrape
    const url = "https://www.nytimes.com/puzzles/spelling-bee";
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // Extract data from the page
    const dataToday = await page.evaluate(() => {
      // Replace this with the actual JavaScript you're scraping
      return JSON.stringify(window.gameData.today);
    });
    const parsed = JSON.parse(dataToday)
    // Close the browser
    await browser.close();
    cachedDailyData = {[today]: parsed}

    // Send the scraped data as a response
    res.json(parsed);
  } catch (error) {
    console.error("Error fetching NYTimes Game Data:", error);
    res.status(500).send("Internal Server Error");
  }
}

    const generateRandomString = function(length=6){
        return Math.random().toString(20).substr(2, length)
        };
  

exports.createNewGame = async (req, res) => {
  const { color, display_name } = req.body;

  if (!display_name || !color) {
    return res.status(400).json({ error: 'display_name and color are required' });
  }

  try {
    let game_code;

    // Ensure the generated game_code is unique
    while (true) {
      game_code = generateRandomString();
      const codeCheck = await client.query('SELECT 1 FROM games WHERE game_code = $1', [game_code]);
      if (codeCheck.rows.length === 0) break; // Exit loop if code is unique
    }

    // Begin transaction
    await client.query('BEGIN');

    // Insert the new game into the games table
    const insertGameQuery = `
      INSERT INTO games (game_code, created_at)
      VALUES ($1, CURRENT_TIMESTAMP)
    `;
    await client.query(insertGameQuery, [game_code]);

    await addUser(display_name, color, game_code)

    // Respond with the new game details
    res.status(201).json({
      message: 'Game created successfully',
      game: { game_code, created_at: new Date(), display_name, color },
    });
  } catch (error) {
    // Rollback in case of error
    await client.query('ROLLBACK');
    console.error('Error creating game:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

    const selectGameUsers = `
      SELECT color, display_name
      FROM game_users
      WHERE game_code = $1
    `;

exports.getGame = async (req, res) => {
  const game_code = req.params.id

  try {

    // Begin transaction
    await client.query('BEGIN');

    // Insert the new game into the games table

    const selectGameWords = `
      SELECT color, word, points
      FROM words
      WHERE game_code = $1
    `;
  
    const users = await client.query(selectGameUsers, [game_code]);
    const words = await client.query(selectGameWords, [game_code]);

    // Respond with the new game details
    res.status(200).json({
      message: 'Game created successfully',
      users: users.rows,
      words:  words.rows,
    });
  } catch (error) {
    // Rollback in case of error
    await client.query('ROLLBACK');
    console.error('Error creating game:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createNewUser = async (req, res) => {
  const game_code = req.params.id
  const { color, display_name } = req.body;

  if (!display_name || !color || !game_code) {
    return res.status(400).json({ error: 'display_name, color, and game_code are required' });
  }

  try {

   await addUser(display_name, color, game_code)       
    const users = await client.query(selectGameUsers, [game_code]);

    req.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          message: `${display_name} just joined the game!`,
          users: users.rows,
          type: 'new_user'
        }));
      }
    });

    await res.status(201).json({
      message: 'User created successfully',
      game: { game_code, created_at: new Date(), display_name, color },
    });

  } catch (error) {
    // Rollback in case of error
    await client.query('ROLLBACK');
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};