"use client";

import { useSearchParams } from "next/navigation";
import { ErrorPage } from "../components/ErrorPage";
import { Suspense } from "react";

const ExpiredGameContent = () => {
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

const ExpiredGame = () => {
  return (
    <Suspense>
      <ExpiredGameContent />
    </Suspense>
  );
};

export default ExpiredGame;
