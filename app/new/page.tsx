"use client";

import { useRouter } from "next/navigation";
import { callPostRoute } from "../utils";
import { UserDetailsBody } from "../components/types";
import UserDetailsForm from "../components/UserDetailsForm";
import { toast } from "react-toastify";

const NewGame = () => {
  const router = useRouter(); // Use the Next.js router

  const createGame = async ({ displayName, color }: UserDetailsBody) => {
    const data = await callPostRoute("/api/game", {
      display_name: displayName,
      color,
    });
    if (data.status === 400) {
      toast.error(data.error);
      return;
    }

    // Change the URL to the game page with the game code
    localStorage.setItem(data.game.gameCode, displayName);
    router.push(`/play/${data.game.gameCode}`);
  };

  return <UserDetailsForm onClick={createGame} newGame />;
};

export default NewGame;
