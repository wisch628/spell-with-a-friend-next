    export const selectGameUsers = `
      SELECT color, display_name
      FROM game_users
      WHERE game_code = $1
    `;