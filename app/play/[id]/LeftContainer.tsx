import { Letters } from "./Letters";
import { Dispatch, SetStateAction } from "react";

import { GameData } from "./types";
import { GameUser, WordObject } from "./WordContainer";
import { WordInput } from "../WordInput";

export const LeftContainer = ({
  gameData,
  currentWord,
  setCurrentWord,
}: {
  gameData: GameData;
  foundWords: WordObject[];
  setFoundWords: Dispatch<SetStateAction<WordObject[]>>;
  setCurrentWord: Dispatch<SetStateAction<string>>;

  player: GameUser;
  currentWord: string;
}) => {
  const { centerLetter, outerLetters } = gameData;

  return (
    <div className="left-container">
      <WordInput
        letters={outerLetters}
        centerLetter={centerLetter}
        word={currentWord.toUpperCase()}
      />
      <Letters
        gameData={gameData}
        onClickLetter={(letter: string) => setCurrentWord(currentWord + letter)}
      />
    </div>
  );
};
