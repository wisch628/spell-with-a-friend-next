import { NextResponse } from "next/server";
import db from "../../../../db";
import { addUser, selectGameUsers } from "../utils";

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

    // Respond with the new game details
    return NextResponse.json(
      {
        message: "Game fetched successfully",
        users: users.rows,
        words: words.rows,
      },
      {}
    );
  } catch (error) {
    // Rollback in case of error
    await db.query("ROLLBACK");
    console.error("Error creating game:", error);
    return NextResponse.json({ status: 500, error: "Could not fetch game" });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const gameCode = (await params).id;
  const body = await request.json();
  const { color, display_name } = body;
  if (!display_name || !color || !gameCode) {
    return NextResponse.json(
      { error: "display_name, color, and gameCode are required" },
      { status: 400 }
    );
  }

  try {
    await addUser(display_name, color, gameCode);
    const users = await db.query(selectGameUsers, [gameCode]);
    // @ts-expect-error global mistyped
    global.io.to(gameCode).emit("new_user", {users: users.rows, message: `${display_name} joined the game`});

    return NextResponse.json(
      {
        message: "User created successfully",
        game: { gameCode, created_at: new Date(), display_name, color },
      },
      { status: 201 }
    );
  } catch (error) {
    // Rollback in case of error
    await db.query("ROLLBACK");
    console.error("Error creating game:", error);
    return NextResponse.json({ status: 500, error: "Could not fetch game" });
  }
}
