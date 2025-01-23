"use client";

import ColorSelector from "./ColorSelector";
import { PageWrapper } from "./PageWrapper";
import Link from "next/link";
import { useState } from "react";
import { UserDetailsBody } from "./types";

const UserDetailsForm = ({
  onClick,
}: {
  onClick: ({ displayName, color }: UserDetailsBody) => Promise<void>;
}) => {
  const [color, setColor] = useState("Red");
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
        <ColorSelector color={color} setColor={setColor} />
        <button onClick={() => onClick({ displayName, color })}>
          Create a Game
        </button>
      </div>
    </PageWrapper>
  );
};

export default UserDetailsForm;
