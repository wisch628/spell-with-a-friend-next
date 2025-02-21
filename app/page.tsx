"use client";

import Link from "next/link";
import { PageWrapper } from "./components/PageWrapper";
import { CreateNewGameButton } from "./components/CreateNewGameButton";
import { BeeAnimation } from "./components/BeeAnimation";

export default function Home() {
  return (
    <PageWrapper>
      <div>
        <BeeAnimation />
        <div className="home_wrapper">
          <h1>Welcome to spell with a friend!</h1>
          <h2>A multiplayer version of the NYTimes Spelling Bee</h2>
          <div>
            <CreateNewGameButton />
            <Link href="/join">
              <button className="home_button">Join an Active Game</button>
            </Link>
          </div>
        </div>
        <BeeAnimation flip />
      </div>
    </PageWrapper>
  );
}
