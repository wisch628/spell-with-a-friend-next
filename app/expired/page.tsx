"use client";

import { useSearchParams } from "next/navigation";
import { ErrorPage } from "../components/ErrorPage";

const ExpiredGame = () => {
  const searchParams = useSearchParams();
  const gameCodeFromParams = searchParams.get("gameCode") || "";
  return (
    <ErrorPage
      errorMessage={`Your game ${
        gameCodeFromParams + " " || ""
      }has expired. You can create a new game below!`}
    />
  );
};

export default ExpiredGame;
