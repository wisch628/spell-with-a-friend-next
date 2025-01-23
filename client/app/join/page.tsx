"use client";

import ColorSelector from "@/components/ColorSelector";
import { PageWrapper } from "@/components/PageWrapper";
import Link from "next/link";
import { useState } from "react";

const JoinGame = () => {
  const [gameLoaded, setGameLoaded] = useState(false);
  const getGame = () => {
    if (!gameLoaded) {
      fetch("http://127.0.0.1:8000/getGame")
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
