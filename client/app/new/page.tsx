"use client";

import { UserDetailsBody } from "@/components/types";
import UserDetailsForm from "@/components/UserDetailsForm";
import { useRouter } from "next/navigation";
import { callApiRoute } from "../utils";

const NewGame = () => {
  const router = useRouter(); // Use the Next.js router

  const createGame = async ({ displayName, color }: UserDetailsBody) => {
    try {
      const response = await callApiRoute("game", {
        display_name: displayName,
        color,
      });
      if (response.ok) {
        const data = await response.json();
        // Change the URL to the game page with the game code
        localStorage.setItem(data.game.game_code, displayName);
        router.push(`/play/${data.game.game_code}`);
      } else {
        const error = await response.json();
        //  setErrorMessage(error.error || "Failed to create the game");
      }
    } catch (error) {
      console.error("Error creating game:", error);
      //  setErrorMessage("Something went wrong");
    }
  };

  return <UserDetailsForm onClick={createGame} newGame />;
};

export default NewGame;
