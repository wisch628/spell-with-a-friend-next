import { NextResponse } from "next/server";
import db from "../../../../db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const gameCode = (await params).id;

  try {
    // Begin transaction
    await db.query("BEGIN");

    // Insert the new game into the games table
    const selectMessages = `
      SELECT color, content, timestamp
      FROM messages
      WHERE game_code = $1
    `;

    const messages = await db.query(selectMessages, [gameCode]);

    // Respond with the new game details
    return NextResponse.json(
      {
        message: "Message retrival successful",
        messages: messages.rows,
      },
      {}
    );
  } catch (error) {
    // Rollback in case of error
    await db.query("ROLLBACK");
    console.error("Error getting messages:", error);
    return NextResponse.json({ status: 500, error: "Could not fetch messages" });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const gameCode = (await params).id;
  const body = await request.json();
  const { content, color  } = body;
  if (!content || !color || !gameCode) {
    return NextResponse.json(
      { error: "Missing required message values" },
      { status: 400 }
    );
  }

  try {
    // Begin transaction
    await db.query('BEGIN');

    const insertMessageQuery = `
      INSERT INTO messages (game_code, color, content)
      VALUES ($1, $2, $3)
    `;
    await db.query(insertMessageQuery, [gameCode, color, content]);

    // Commit the transaction
    await db.query('COMMIT');
    const getUpdatedMessages = `
      SELECT content, color, timestamp
      FROM messages
      WHERE game_code = $1
    `;
    const messages = await db.query(getUpdatedMessages, [gameCode]);
    // @ts-expect-error global mistyped
    global.io
      .to(gameCode)
      .emit("new_message", {
       message: `A new message has been sent`,
          messages: messages.rows,
          type: 'new_message'
      });

    return NextResponse.json(
      {
       message: 'Message added successfully',
      messages: messages.rows,
      },
      { status: 201 }
    );
  } catch (error) {
    // Rollback in case of error
    await db.query("ROLLBACK");
    console.error('Error adding message:', error);
    return NextResponse.json({ status: 500, error: "Could not add message" });
  }
}
