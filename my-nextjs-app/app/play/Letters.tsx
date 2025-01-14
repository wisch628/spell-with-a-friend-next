"use client";

import React, { useEffect, useState } from "react";
import { Hexagon } from "./Hexagon";

interface GameData {
  answers?: string[];
  centerLetter: string;
  displayDate?: string;
  displayWeekday?: string;
  outerLetters: string[];
  panagrams?: string[];
  validLetters?: string[];
}

export const Letters = () => {
  const [gameData, setGameData] = useState<GameData>({
    outerLetters: [],
    centerLetter: "",
  });
  const [outside, setOutside] = useState<string[]>([]);
  useEffect(() => {
    // Call the Python endpoint
    fetch("http://127.0.0.1:8000/today")
      .then((response) => response.json())
      .then((data) => {
        setGameData(data);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

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
          <Hexagon letter={outside[0]} className={["hex", "odd"].join(" ")} />
          <Hexagon letter={outside[1]} className="hex" />
          <Hexagon letter={outside[2]} className={["hex", "odd"].join(" ")} />
        </div>
        <div className="game-wrapper">
          <Hexagon letter={outside[3]} className={["hex", "odd"].join(" ")} />
          <Hexagon
            letter={gameData.centerLetter.toUpperCase()}
            className={["hex", "center"].join(" ")}
          />
          <Hexagon letter={outside[4]} className={["hex", "odd"].join(" ")} />
        </div>
        <div className={["game-wrapper", "special"].join(" ")}>
          <Hexagon letter={outside[5]} className="hex" />
        </div>
      </div>
    </div>
  );
};
