"use client";

import React, { useEffect, useState } from "react";
import { GameData } from "./types";
import Image from "next/image";

export const Letters = ({
  gameData,
  onClickLetter,
}: {
  gameData: GameData;
  onClickLetter: (letter: string) => void;
}) => {
  const [outside, setOutside] = useState<string[]>([]);
  const centerLetter = gameData.centerLetter.toUpperCase();

  useEffect(() => {
    setOutside(gameData.outerLetters.map((letter) => letter.toUpperCase()));
  }, [gameData.outerLetters]);

  const shuffleLetters = () => {
    setOutside((prev) => [...prev].sort(() => Math.random() - 0.5));
  };

  return (
    <div>
      <Image
        onClick={shuffleLetters}
        src="/images/shuffle.png"
        alt="shuffle"
        height={30}
        width={30}
        className="shuffle"
      />
      <div className="game-container">
        <div>
          <div
            className="hexagon top-row"
            onClick={() => onClickLetter(outside[0])}
          >
            {outside[0]}
          </div>
          <div
            className="hexagon left-top"
            onClick={() => onClickLetter(outside[1])}
          >
            {outside[1]}
          </div>
          <div
            className="hexagon left-bottom"
            onClick={() => onClickLetter(outside[2])}
          >
            {outside[2]}
          </div>
          <div
            className="hexagon center"
            onClick={() => onClickLetter(centerLetter)}
          >
            {centerLetter}
          </div>
          <div
            className="hexagon right-top"
            onClick={() => onClickLetter(outside[3])}
          >
            {outside[3]}
          </div>
          <div
            className="hexagon right-bottom"
            onClick={() => onClickLetter(outside[4])}
          >
            {outside[4]}
          </div>
          <div
            className="hexagon bottom-row"
            onClick={() => onClickLetter(outside[5])}
          >
            {outside[5]}
          </div>
        </div>
      </div>
    </div>
  );
};
