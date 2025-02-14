import { NextResponse } from "next/server";
import { getRelevantDate } from "./utils";
import puppeteer from "puppeteer";

let cachedDailyData: Record<string, string> = {};

export async function GET() {
  try {
    const today = getRelevantDate();
    if (cachedDailyData[today]) {
      return NextResponse.json(
        cachedDailyData[today],
        { status: 200 }
      );
    }
    // Launch the browser
    const browser = await puppeteer.launch({
      headless: true, // Set to 'false' to see the browser window
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    // Create a new page
    const page = await browser.newPage();

    // Go to the webpage you want to scrape
    const url = "https://www.nytimes.com/puzzles/spelling-bee";
    await page.goto(url, { waitUntil: "domcontentloaded" });

    // Extract data from the page
    const dataToday = await page.evaluate(() => {
      // @ts-expect-error nytimes window has this object
      return JSON.stringify(window.gameData.today);
    });
    const data = JSON.parse(dataToday);
    // Close the browser
    await browser.close();
    cachedDailyData = { [today]: data };

    // Send the scraped data as a response
    return NextResponse.json( data, { status: 200 });
  } catch (error) {
    console.error("Error fetching NYTimes Game Data:", error);
    return NextResponse.json({ status: 500 });
  }
}
