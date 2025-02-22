import { NextResponse } from "next/server";
import db from "../../../../db";
import { addUser, selectGameUsers } from "../utils";
import { GameUser } from "../../../types";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const gameCode = (await params).id;

  try {
    // Begin transaction
    await db.query("BEGIN");

  const games = await db.query(
        "SELECT * FROM games WHERE game_code = $1",
        [gameCode]
      );
      if (games.rows.length === 0) {
        return NextResponse.json({ status: 400, error: "Sorry, that game code does not exist" });
      }

    const selectGameWords = `
      SELECT color, word, points
      FROM words
      WHERE game_code = $1
    `;

    const users = await db.query(selectGameUsers, [gameCode]);
    const words = await db.query(selectGameWords, [gameCode]);
    const createdDate = new Date(games.rows[0].created_at as Date);
    const today = new Date()
    const hourDifference = (today.getTime() - createdDate.getTime()) / (1000 * 60 * 60);
    const isOldGame = hourDifference > 24;
      if (words.rows.length > 0 && isOldGame){
        const messageResult = await db.query('DELETE FROM messages WHERE game_code = $1 RETURNING *;', [gameCode]);
        const deleteResult = await db.query('DELETE FROM games WHERE game_code = $1 RETURNING *;', [gameCode])
        console.log(`Deleted ${messageResult.rows.length} messages and ${deleteResult.rows.length} game and user rows.`)
        await db.query('COMMIT');

        return NextResponse.json({ status: 410, error: "Game is expired, please make a new one" });

      }

    // Respond with the new game details
    return NextResponse.json(
      {
        message: "Game fetched successfully",
        users: users.rows,
        words: words.rows,
        status: 200,
      },
      {}
    );
  } catch (error) {
    // Rollback in case of error
    await db.query("ROLLBACK");
    console.error("Error getting the game:", error);
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
  const newUser = display_name.toLowerCase()
  if (!newUser || !color || !gameCode) {
    return NextResponse.json(
      { error: "Display name, color, and game code are required", status: 400 },
    );
  }

  try {
    const initialUsers = await db.query(selectGameUsers, [gameCode]);
    const usernameTaken = initialUsers.rows.filter((user: GameUser) => user.display_name.toLowerCase() === newUser).length !== 0
    if (usernameTaken) {
         return NextResponse.json(
      { error: `The username "${newUser}" is already taken. Please try a new name.`, status: 500 },
    );
    }
    await addUser(newUser, color, gameCode);
    const users = await db.query(selectGameUsers, [gameCode]);
    // @ts-expect-error global mistyped
    global.io.to(gameCode).emit("new_user", {users: users.rows, message: `${display_name} joined the game`});

    return NextResponse.json(
      {
        message: "User created successfully",
        game: { gameCode, created_at: new Date(), display_name: newUser, color },
        status: 201
      },
    );
  } catch (error) {
    // Rollback in case of error
    await db.query("ROLLBACK");
    console.error("Error creating game:", error);
    return NextResponse.json({ status: 500, error: "Could not fetch game" });
  }
}
