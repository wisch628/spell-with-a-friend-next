import { BeeAnimation } from "@/app/components/BeeAnimation";
import React from "react";

export const Loading = () => {
  return (
    <div className="loaderContainer">
      <div className="loader">
        <BeeAnimation />
        <h1>{`Pulling Today's NYTimes Puzzle...`}</h1>
        <BeeAnimation flip />
      </div>
    </div>
  );
};
