import React from "react";

export const WordInput = ({
  word,
  letters,
  centerLetter,
}: {
  word: string;
  letters: string[];
  centerLetter: string;
}) => {
  const hasLetters = !!word.length;
  if (!hasLetters) {
    return (
      <div className="empty word_input">
        <span>Type Your Word Here</span>
      </div>
    );
  }

  const getClassName = (letter: string) => {
    if (letter === centerLetter) return "center_letter";
    if (letters.indexOf(letter) !== -1) return "outer_letters";
    return "";
  };

  return (
    <div className="hasLetters word_input">
      {word.split("").map((letter, index) => {
        return (
          <span key={index} className={getClassName(letter)}>
            {letter.toUpperCase()}
          </span>
        );
      })}
      <span className="cursor" />
    </div>
  );
};
