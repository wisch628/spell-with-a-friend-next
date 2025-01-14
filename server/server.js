const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors'); // Import CORS
const { Client } = require('pg');  // Import the PostgreSQL client
const app = express();

// Enable CORS for all origins or specific origin
app.use(cors({
  origin: 'http://localhost:3001'  // Allow requests from frontend running on this port
}));

// PostgreSQL connection setup
const client = new Client({
  host: 'spell-with-a-friend.cluster-ck75izwfyrkk.us-east-2.rds.amazonaws.com',
  port: 5432,
  user: 'postgres',
  password: 'spellwithafriend',
  database: 'postgres',
});

// Connect to the PostgreSQL database
client.connect()
  .then(() => console.log('Connected to the PostgreSQL database'))
  .catch((err) => console.error('Connection error', err.stack));

// Define a route to scrape the data
app.get('/today', async (req, res) => {
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
    console.error("Error fetching data:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Start the server
app.listen(8000, () => {
  console.log("Server is running on http://localhost:8000");
});