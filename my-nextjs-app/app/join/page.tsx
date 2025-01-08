"use client";

import ColorSelector from "@/components/ColorSelector";
import { PageWrapper } from "@/components/PageWrapper";

const JoinGame = () => {
  const onSubmit = () => {};
  return (
    <PageWrapper>
      <form className="userLogin" onSubmit={onSubmit}>
        <ColorSelector />
        <p>Enter the six digit code of the game you want to join</p>
        <input
          placeholder="Game Code"
          type="text"
          name="gameCode"
          defaultValue=""
        />
        <button type="submit">Join Game</button>
      </form>
    </PageWrapper>
  );
};

export default JoinGame;
