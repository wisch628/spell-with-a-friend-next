import React from "react";

export interface WordObject {
  word: string;
  color: string;
}

export interface GameUsers {
  color: string;
  id: number;
}

export const WordContainer = ({
  correctWords,
  gameUsers,
}: {
  correctWords: WordObject[];
  gameUsers: GameUsers[];
}) => {
  return (
    <div className="right-container">
      <p>Your team has found {correctWords.length || 0} words</p>
      <div className="word-container">
        {correctWords.length > 0
          ? correctWords.map((wordObject) => {
              const capitalized =
                wordObject.word.charAt(0).toUpperCase() +
                wordObject.word.slice(1);
              const color = wordObject.color;
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
