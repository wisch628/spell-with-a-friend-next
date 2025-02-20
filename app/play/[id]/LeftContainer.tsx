import { Letters } from "./Letters";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { GameData } from "./types";
import { WordInput } from "../WordInput";
import { GameButtons } from "../GameButtons";

export const LeftContainer = ({
  gameData,
  currentWord,
  setCurrentWord,
  deleteLetter,
  submitWord,
}: {
  gameData: GameData;
  currentWord: string;
  setCurrentWord: Dispatch<SetStateAction<string>>;
  deleteLetter: () => void;
  submitWord: () => Promise<void>;
}) => {
  const [outside, setOutside] = useState<string[]>([]);
  const { centerLetter, outerLetters } = gameData;
  useEffect(() => {
    setOutside(gameData.outerLetters.map((letter) => letter.toUpperCase()));
  }, [gameData.outerLetters]);

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
        outsideLetters={outside}
      />
      <GameButtons
        setOutside={setOutside}
        deleteLetter={deleteLetter}
        submitWord={submitWord}
      />
    </div>
  );
};
