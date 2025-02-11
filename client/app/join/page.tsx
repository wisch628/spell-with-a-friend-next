"use client";

import { PageWrapper } from "@/components/PageWrapper";
import { UserDetailsBody } from "@/components/types";
import UserDetailsForm from "@/components/UserDetailsForm";
import { Suspense, useEffect, useState } from "react";
import { callPostRoute } from "../utils";
import { useRouter, useSearchParams } from "next/navigation";
import { defaultColors } from "@/components/constants";
import { CreateNewGameButton } from "@/components/CreateNewGameButton";

const JoinGameContent = () => {
  const [gameLoaded, setGameLoaded] = useState(false);
  const [gameCode, setGameCode] = useState("");
  const [availableColors, setAvailableColors] = useState<string[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const gameCodeFromParams = searchParams.get("gameCode");

  useEffect(() => {
    if (gameCodeFromParams) setGameCode(gameCodeFromParams as string);
  }, [gameCodeFromParams]);

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
  if (gameLoaded && availableColors.length === 0) {
    return (
      <PageWrapper>
        <div>
          <p>Sorry, that game is full. Create a new one below!</p>
          <CreateNewGameButton />
        </div>
      </PageWrapper>
    );
  }

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

const JoinGame = () => {
  return (
    <Suspense>
      <JoinGameContent />
    </Suspense>
  );
};

export default JoinGame;
