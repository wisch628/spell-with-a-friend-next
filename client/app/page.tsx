"use client";

import Link from "next/link";
import Image from "next/image";
import styling from "@/components/home.module.css";
import { PageWrapper } from "@/components/PageWrapper";
import { CreateNewGameButton } from "@/components/CreateNewGameButton";
import { useEffect } from "react";
import { io } from "socket.io-client";

export default function Home() {
  useEffect(() => {
    const socket = io();

    socket.on("connect", () => {
      console.log("Connected to server");
    });
    fetch("/api/game/5982ch", { method: "GET" })
      .then((response) => response.json())
      .then((response) => {
        console.log({ response });
      });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <PageWrapper>
      <div>
        <div className={styling.center}>
          <Image
            src="/images/double-bee.png"
            alt="bee icon"
            width={100}
            height={100}
          />
          {/* {isLoggedIn ? ( */}
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
