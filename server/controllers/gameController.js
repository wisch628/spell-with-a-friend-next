const puppeteer = require('puppeteer');
const client = require('../db');

exports.getTodaysData = async (_, res) => {
  try {
    // Launch the browser
    const browser = await puppeteer.launch({
      headless: true, // Set to 'false' to see the browser window
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

    // Close the browser
    await browser.close();

    // Send the scraped data as a response
    res.json(JSON.parse(dataToday));
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

    // Insert the user into the user_games table
    const insertUserGameQuery = `
      INSERT INTO game_users (game_code, display_name, color)
      VALUES ($1, $2, $3)
    `;
    await client.query(insertUserGameQuery, [game_code, display_name, color]);

    // Commit the transaction
    await client.query('COMMIT');

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