"use client";

import Link from "next/link";
import Image from "next/image";
import { PageWrapper } from "./components/PageWrapper";
import { CreateNewGameButton } from "./components/CreateNewGameButton";

export default function Home() {
  return (
    <PageWrapper>
      <div>
        <div className="home_wrapper">
          <Image
            src="/images/double-bee.png"
            alt="bee icon"
            width={100}
            height={45.31}
          />
          <div>
            <h1>Welcome to spell with a friend!</h1>
            <h2>A multiplayer version of the NYTimes Spelling Bee</h2>
            <div>
              <CreateNewGameButton />
              <Link href="/join">
                <button>Join an Active Game</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
