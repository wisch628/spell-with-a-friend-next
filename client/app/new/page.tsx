"use client";

import { UserDetailsBody } from "@/components/types";
import UserDetailsForm from "@/components/UserDetailsForm";
import { useRouter } from "next/navigation";

const NewGame = () => {
  const router = useRouter(); // Use the Next.js router

  const createGame = async ({ displayName, color }: UserDetailsBody) => {
    try {
      const response = await fetch("http://localhost:8000/game", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          display_name: displayName,
          color,
        }),
      });
      console.log(response);
      debugger;
      if (response.ok) {
        const data = await response.json();
        // Change the URL to the game page with the game code
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

  return <UserDetailsForm onClick={createGame} />;
};

export default NewGame;
