import { NextResponse } from "next/server";
import db from "../../../../db";
import { calculatePoints } from "./utils";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const gameCode = (await params).id;
  const body = await request.json();
  const { word, color, isPangram } = body;
  if (!word || !color || !gameCode) {
    return NextResponse.json(
      { error: "Missing required word values" },
      { status: 400 }
    );
  }

  try {
    // Begin transaction
    await db.query("BEGIN");

    const checkIfExists = `
      SELECT word
      FROM words
      WHERE word = $1
      and game_code = $2
    `;
    const wordExists = await db.query(checkIfExists, [word, gameCode]);
    if (wordExists.rows.length > 0) {
      throw Error("That word already exists");
    }
    const points = calculatePoints(word, isPangram);

    const insertWordQuery = `
      INSERT INTO words (game_code, color, word, points)
      VALUES ($1, $2, $3, $4)
    `;
    await db.query(insertWordQuery, [gameCode, color, word, points]);

    // Commit the transaction
    await db.query("COMMIT");
    const getUpdatedWords = `
      SELECT word, color, points
      FROM words
      WHERE game_code = $1
    `;
    const words = await db.query(getUpdatedWords, [gameCode]);
    // @ts-expect-error global mistyped
    global.io.to(gameCode).emit("new_word", {
      message: `A new word has been added`,
      words: words.rows,
    });

    return NextResponse.json(
      {
        message: "Word added successfully",
        words: words.rows,
      },
      { status: 201 }
    );
  } catch (error) {
    // Rollback in case of error
    await db.query("ROLLBACK");
    console.error("Error adding word:", error);
    return NextResponse.json({ status: 500, error: "Could not add word" });
  }
}
