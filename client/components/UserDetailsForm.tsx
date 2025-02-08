"use client";

import ColorSelector from "./ColorSelector";
import { PageWrapper } from "./PageWrapper";
import { KeyboardEventHandler, useState } from "react";
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

  const pressEnter: KeyboardEventHandler<HTMLInputElement> = async (e) => {
    if (e.key === "Enter") {
      onClick({ displayName, color });
    }
  };

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
          onKeyUp={pressEnter}
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
