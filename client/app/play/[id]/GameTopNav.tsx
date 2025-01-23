import Image from "next/image";
import Link from "next/link";
import React from "react";

export const GameTopNav = ({
  displayWeekday,
  displayDate,
}: {
  displayWeekday: string;
  displayDate: string;
}) => {
  const user = {
    firstName: "Hannah",
  };
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
      <h3>Player: {user.firstName}</h3>
      <h3>
        Color: <span className="blue">Blue</span>
      </h3>

      <button onClick={() => {}}>Invite Friends</button>
      <Link href={`/allgames`}>
        <button>Load other games</button>{" "}
      </Link>
      <button onClick={() => {}}>Your Team</button>
      <Link href="/">
        <button onClick={() => {}}>Logout</button>
      </Link>
    </nav>
  );
};
