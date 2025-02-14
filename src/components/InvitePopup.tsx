import { INVITE_FRIEND_ROUTE } from "@/app/play/[id]/consts";
import Link from "next/link";
import { ForwardedRef, forwardRef } from "react";

export const InvitePopUp = forwardRef(
  (
    {
      gameCode,
      togglePopup,
    }: {
      gameCode: string;
      togglePopup: () => void;
    },
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const url = `${INVITE_FRIEND_ROUTE}${gameCode}`;
    return (
      <div className="modal">
        <div className="modal_content" ref={ref}>
          <span className="close" onClick={togglePopup}>
            &times;
          </span>
          <h3>Invite friends to join at</h3>
          <Link
            className="Blue"
            href={url}
            rel="noopener noreferrer"
            target="_blank"
          >
            {window.location.host + url}
          </Link>
        </div>
      </div>
    );
  }
);

InvitePopUp.displayName = "InviteComponent";
