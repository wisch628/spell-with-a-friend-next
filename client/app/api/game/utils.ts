import db from "../../../db";

export const selectGameUsers = `
      SELECT color, display_name
      FROM game_users
      WHERE game_code = $1
    `;

export const generateRandomString = function (length = 6) {
  return Math.random().toString(20).substr(2, length);
};


export const addUser = async (display_name: string, color: string, gameCode: string) => {
 const insertUserGameQuery = `
      INSERT INTO game_users (game_code, display_name, color)
      VALUES ($1, $2, $3)
    `;
    await db.query(insertUserGameQuery, [gameCode, display_name, color]);

    // Commit the transaction
    await db.query('COMMIT');
}