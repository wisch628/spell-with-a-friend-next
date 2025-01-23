"use client";

import React, { useEffect, useState } from "react";
import { Hexagon } from "./Hexagon";
import { GameData } from "./types";

export const Letters = ({
  gameData,
  onClickLetter,
}: {
  gameData: GameData;
  onClickLetter: (letter: string) => void;
}) => {
  const [outside, setOutside] = useState<string[]>([]);

  useEffect(() => {
    setOutside(gameData.outerLetters.map((letter) => letter.toUpperCase()));
  }, [gameData.outerLetters]);
  const letterClick = () => {};

  const shuffleLetters = () => {
    setOutside((prev) => [...prev].sort(() => Math.random() - 0.5));
  };

  return (
    <div>
      <button type="button" onClick={shuffleLetters}>
        Shuffle Letters
      </button>
      <div className="game-container" onClick={letterClick}>
        <div className="game-wrapper">
          <Hexagon
            onClick={onClickLetter}
            letter={outside[0]}
            className={["hex", "odd"].join(" ")}
          />
          <Hexagon
            onClick={onClickLetter}
            letter={outside[1]}
            className="hex"
          />
          <Hexagon
            onClick={onClickLetter}
            letter={outside[2]}
            className={["hex", "odd"].join(" ")}
          />
        </div>
        <div className="game-wrapper">
          <Hexagon
            onClick={onClickLetter}
            letter={outside[3]}
            className={["hex", "odd"].join(" ")}
          />
          <Hexagon
            onClick={onClickLetter}
            letter={gameData.centerLetter.toUpperCase()}
            className={["hex", "center"].join(" ")}
          />
          <Hexagon
            onClick={onClickLetter}
            letter={outside[4]}
            className={["hex", "odd"].join(" ")}
          />
        </div>
        <div className={["game-wrapper", "special"].join(" ")}>
          <Hexagon
            onClick={onClickLetter}
            letter={outside[5]}
            className="hex"
          />
        </div>
      </div>
    </div>
  );
};
