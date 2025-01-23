import React from "react";

interface WordObject {
  word: string;
  userId: number;
}

interface GameUsers {
  color: string;
  id: number;
}

export const WordContainer = () => {
  const correctWords: WordObject[] = [];
  const gameUsers: GameUsers[] = [];
  return (
    <div className="right-container">
      <p>Your team has found {correctWords.length || 0} words</p>
      <div className="word-container">
        {correctWords.length > 0
          ? correctWords.map((wordObject) => {
              const capitalized =
                wordObject.word.charAt(0).toUpperCase() +
                wordObject.word.slice(1);
              const user = gameUsers.filter(
                (user) => user.id === wordObject.userId
              )[0];
              const color = user.color;
              return (
                <p
                  className={["correct", color].join(" ")}
                  key={wordObject.word}
                >
                  {capitalized}
                </p>
              );
            })
          : "Start Guessing!"}
      </div>
    </div>
  );
};
