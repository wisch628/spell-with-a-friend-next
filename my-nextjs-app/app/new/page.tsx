"use client";

import ColorSelector from "@/components/ColorSelector";
import { PageWrapper } from "@/components/PageWrapper";
import Link from "next/link";

const NewGame = () => {
  return (
    <PageWrapper>
      <div className="userLogin">
        <ColorSelector />
        <Link href="/play">
          <button>Create a Game</button>
        </Link>
      </div>
    </PageWrapper>
  );
};

export default NewGame;
