"use client";

import ColorSelector from "./ColorSelector";
import { PageWrapper } from "./PageWrapper";
import { useState } from "react";
import { UserDetailsBody } from "./types";
import { defaultColors } from "./constants";

const UserDetailsForm = ({
  onClick,
  newGame,
  colors = defaultColors,
}: {
  onClick: ({ displayName, color }: UserDetailsBody) => Promise<void>;
  newGame: boolean;
  colors?: string[];
}) => {
  const [color, setColor] = useState(colors[0]);
  const [displayName, setDisplayName] = useState("");

  return (
    <PageWrapper>
      <div className="userLogin">
        <p>Enter your display name</p>
        <input
          placeholder="Display name"
          type="text"
          name="displayName"
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
        />
        <ColorSelector color={color} setColor={setColor} colors={colors} />
        <button onClick={() => onClick({ displayName, color })}>
          {newGame ? "Create a New Game" : "Join Game"}
        </button>
      </div>
    </PageWrapper>
  );
};

export default UserDetailsForm;
