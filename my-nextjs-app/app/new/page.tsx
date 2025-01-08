"use client";

import ColorSelector from "@/components/ColorSelector";
import { PageWrapper } from "@/components/PageWrapper";

const NewGame = () => {
  return (
    <PageWrapper>
      <div className="userLogin">
        <ColorSelector />
        <div>
          <button onClick={() => {}}>Create a Game</button>
        </div>
      </div>
    </PageWrapper>
  );
};

export default NewGame;
