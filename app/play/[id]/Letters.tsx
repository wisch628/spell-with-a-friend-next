"use client";

import React from "react";
import { GameData } from "./types";

export const Letters = ({
  gameData,
  onClickLetter,
  outsideLetters,
}: {
  gameData: GameData;
  outsideLetters: string[];
  onClickLetter: (letter: string) => void;
}) => {
  const centerLetter = gameData.centerLetter.toUpperCase();

  return (
    <div>
      <div className="game-container">
        <div>
          <div
            className="hexagon top-row"
            onClick={() => onClickLetter(outsideLetters[0])}
          >
            {outsideLetters[0]}
          </div>
          <div
            className="hexagon left-top"
            onClick={() => onClickLetter(outsideLetters[1])}
          >
            {outsideLetters[1]}
          </div>
          <div
            className="hexagon left-bottom"
            onClick={() => onClickLetter(outsideLetters[2])}
          >
            {outsideLetters[2]}
          </div>
          <div
            className="hexagon center"
            onClick={() => onClickLetter(centerLetter)}
          >
            {centerLetter}
          </div>
          <div
            className="hexagon right-top"
            onClick={() => onClickLetter(outsideLetters[3])}
          >
            {outsideLetters[3]}
          </div>
          <div
            className="hexagon right-bottom"
            onClick={() => onClickLetter(outsideLetters[4])}
          >
            {outsideLetters[4]}
          </div>
          <div
            className="hexagon bottom-row"
            onClick={() => onClickLetter(outsideLetters[5])}
          >
            {outsideLetters[5]}
          </div>
        </div>
      </div>
    </div>
  );
};
