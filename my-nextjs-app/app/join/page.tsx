"use client";

import ColorSelector from "@/components/ColorSelector";
import { PageWrapper } from "@/components/PageWrapper";
import Link from "next/link";
import { useState } from "react";

const JoinGame = () => {
  const [gameLoaded, setGameLoaded] = useState(false);
  const getGame = () => {
    if (!gameLoaded) {
      console.log("game not loaded");
      fetch("http://127.0.0.1:8000/getGame")
        // .then((response) => response.json())
        .then(() => {
          setGameLoaded(true);
        })
        .catch((error) => console.error("Error:", error));
    } else {
      console.log("next call");
    }
  };
  return (
    <PageWrapper>
      {gameLoaded ? (
        <div>
          <p>Enter your display name</p>
          <input
            placeholder="Display name"
            type="text"
            name="displayName"
            defaultValue=""
          />
          <ColorSelector />
          <Link href="play">
            <button>Start Playing</button>
          </Link>
        </div>
      ) : (
        <div>
          {" "}
          <p>Enter the six digit code of the game you want to join</p>
          <input
            placeholder="Game Code"
            type="text"
            name="gameCode"
            defaultValue=""
          />
          <button onClick={getGame}>Join Game</button>
        </div>
      )}
    </PageWrapper>
  );
};

export default JoinGame;
