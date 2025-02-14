import { NextResponse } from "next/server";
import db from "../../../../db";
import { selectGameUsers } from "./utils";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const gameCode = (await params).id;

  try {
    // Begin transaction
    await db.query("BEGIN");

    // Insert the new game into the games table

    const selectGameWords = `
      SELECT color, word, points
      FROM words
      WHERE game_code = $1
    `;

    const users = await db.query(selectGameUsers, [gameCode]);
    const words = await db.query(selectGameWords, [gameCode]);
    
    // @ts-expect-error global mistyped
    global.io.to(gameCode).emit("game_loaded");
    

    // Respond with the new game details
    return NextResponse.json({
      message: "Game fetched successfully",
      users: users.rows,
      words: words.rows,
    }, {});
  } catch (error) {
    // Rollback in case of error
    await db.query("ROLLBACK");
    console.error("Error creating game:", error);
    return NextResponse.json({status: 500, error: "Could not fetch game"})
  }
}
