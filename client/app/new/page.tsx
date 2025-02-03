"use client";

import { UserDetailsBody } from "@/components/types";
import UserDetailsForm from "@/components/UserDetailsForm";
import { useRouter } from "next/navigation";
import { callPostRoute } from "../utils";

const NewGame = () => {
  const router = useRouter(); // Use the Next.js router

  const createGame = async ({ displayName, color }: UserDetailsBody) => {
    const data = await callPostRoute("game", {
      display_name: displayName,
      color,
    });

    // Change the URL to the game page with the game code
    localStorage.setItem(data.game.game_code, displayName);
    router.push(`/play/${data.game.game_code}`);
  };

  return <UserDetailsForm onClick={createGame} newGame />;
};

export default NewGame;
