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

  return (
    <nav className="top">
      {!isMobile && (
        <h3>
          {displayWeekday} {displayDate}
        </h3>
      )}
      <div className="nav_child">
        <h3>
          Player:{" "}
          <span className={user.color}>{captialize(user.display_name)}</span>
        </h3>
        <button
          className="thin_border_button"
          onClick={() => togglePopUp("invite")}
        >
          Invite Friends
        </button>

        <Link href="/">
          <button className="close">X</button>
        </Link>
      </div>
    </nav>
  );
};
