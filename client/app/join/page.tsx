"use client";

import { PageWrapper } from "@/components/PageWrapper";
import { UserDetailsBody } from "@/components/types";
import UserDetailsForm from "@/components/UserDetailsForm";
import { useState } from "react";
import { callPostRoute } from "../utils";
import { useRouter } from "next/navigation";
import { defaultColors } from "@/components/constants";

const JoinGame = () => {
  const [gameLoaded, setGameLoaded] = useState(false);
  const [gameCode, setGameCode] = useState("");
  const [availableColors, setAvailableColors] = useState<string[]>([]);
  const router = useRouter();

  const getGame = () => {
    if (!gameLoaded) {
      fetch(`http://127.0.0.1:8000/game/${gameCode}`)
        .then((response) => response.json())
        .then((response) => {
          const usedColors = response.users.map(
            ({ color }: { color: string }) => color
          );
          setAvailableColors(
            defaultColors.filter((color) => usedColors.indexOf(color) === -1)
          );
          setGameLoaded(true);
        })
        .catch((error) => console.error("Error:", error));
    }
  };

  const goToGame = async ({ displayName, color }: UserDetailsBody) => {
    await callPostRoute(`game/${gameCode}/user`, {
      display_name: displayName,
      color,
    });
    // Change the URL to the game page with the game code
    localStorage.setItem(gameCode, displayName);
    router.push(`/play/${gameCode}`);
  };

  return (
    <PageWrapper>
      {gameLoaded ? (
        <UserDetailsForm
          newGame={false}
          onClick={goToGame}
          colors={availableColors}
        />
      ) : (
        <div>
          {" "}
          <p>Enter the six digit code of the game you want to join</p>
          <input
            placeholder="Game Code"
            type="text"
            name="gameCode"
            value={gameCode}
            onChange={(e) => setGameCode(e.target.value)}
          />
          <button onClick={getGame}>Join Game</button>
        </div>
      )}
    </PageWrapper>
  );
};

export default JoinGame;
