import React from "react";

export const Loading = () => {
  return (
    <div className="loaderContainer">
      <h1>Pulling Todays NYTimes Puzzle...</h1>
      <div className="loader"></div>
    </div>
  );
};
