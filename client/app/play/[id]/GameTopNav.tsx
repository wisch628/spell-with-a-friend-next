import Image from "next/image";
import Link from "next/link";
import React from "react";
import { GameUser } from "./WordContainer";

export const GameTopNav = ({
  displayWeekday,
  displayDate,
  user,
}: {
  displayWeekday: string;
  displayDate: string;
  user: GameUser;
}) => {
  return (
    <nav className="top">
      <Image
        alt="menu"
        // onClick={() => togglePopUp("sideMenu")}
        src="/images/hamburger.png"
        width={30}
        height={30}
      />
      <h3>
        {displayWeekday} {displayDate}
      </h3>
      <h3>
        Player: <span className={user.color}>{user.display_name}</span>
      </h3>

      <button onClick={() => {}}>Invite Friends</button>

      <button onClick={() => {}}>Your Team</button>
      <Link href="/">
        <button onClick={() => {}}>Exit Game</button>
      </Link>
    </nav>
  );
};
