"use client";

import React from "react";

export const Hexagon = ({
  className,
  letter,
  onClick,
}: {
  className: string;
  letter: string;
  onClick: (letter: string) => void;
}) => {
  return (
    <div
      className={className}
      style={{ cursor: "pointer" }}
      onClick={() => onClick(letter)}
    >
      <div className="cell-top" />
      <div className="cell-center">
        <h5>{letter}</h5>
      </div>
      <div className="cell-bottom" />
    </div>
  );
};
