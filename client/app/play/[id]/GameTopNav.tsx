import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { GameUser } from "./WordContainer";
import { PopUp } from "./types";
import { captialize } from "@/app/utils";

export const GameTopNav = ({
  displayWeekday,
  displayDate,
  user,
  togglePopUp,
}: {
  displayWeekday: string;
  displayDate: string;
  user: GameUser;
  togglePopUp: (newPopup: PopUp) => void;
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 540);

    handleResize(); // Check on mount
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getGameInfo = () => {
    return (
      <>
        {" "}
        <h3>
          Player:{" "}
          <span className={user.color}>{captialize(user.display_name)}</span>
        </h3>
        <button onClick={() => togglePopUp("invite")}>Invite Friends</button>
      </>
    );
  };
  return (
    <nav className="top">
      {!isMobile && <div className="nav_child">{getGameInfo()}</div>}

      <div className="nav_child">
        {isMobile ? (
          getGameInfo()
        ) : (
          <h3>
            {displayWeekday} {displayDate}
          </h3>
        )}
        <Link href="/">
          <button>X</button>
        </Link>
      </div>
    </nav>
  );
};
