import { NextResponse } from "next/server";
import db from "../../../db";
import { addUser, generateRandomString } from "./utils";


export async function POST(request: Request) {
  const body = await request.json();
  const { color, display_name } = body;
  if (!display_name || !color) {
    return NextResponse.json(
      { error: "Display name and color are required", status: 400 },
    );
  }

  try {
    let gameCode;

    // Ensure the generated gameCode is unique
    while (true) {
      gameCode = generateRandomString();
      const codeCheck = await db.query(
        "SELECT 1 FROM games WHERE game_code = $1",
        [gameCode]
      );
      if (codeCheck.rows.length === 0) break; // Exit loop if code is unique
    }

    // Begin transaction
    await db.query("BEGIN");

    // Insert the new game into the games table
    const insertGameQuery = `
      INSERT INTO games (game_code, created_at)
      VALUES ($1, CURRENT_TIMESTAMP)
    `;
    await db.query(insertGameQuery, [gameCode]);

    await addUser(display_name, color, gameCode);

    return NextResponse.json(
      {
        message: "Game created successfully",
        game: { gameCode, created_at: new Date(), display_name, color },
        status: 201
      }
    );
  } catch (error) {
    // Rollback in case of error
    await db.query("ROLLBACK");
    console.error("Error creating game:", error);
    return NextResponse.json({ status: 500, error: "Could not fetch game" });
  }
}
