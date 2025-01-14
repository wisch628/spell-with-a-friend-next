"use client";

import React from "react";

export const Hexagon = ({
  className,
  letter,
}: {
  className: string;
  letter: string;
}) => {
  return (
    <div className={className} style={{ cursor: "pointer" }}>
      <div className="cell-top" />
      <div className="cell-center">
        <h5>{letter}</h5>
      </div>
      <div className="cell-bottom" />
    </div>
  );
};
