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
    const url = `www.${window.location.host}/join?game=${gameCode}`;
    return (
      <div className="modal">
        <div className="modal_content" ref={ref}>
          <span className="close" onClick={togglePopup}>
            &times;
          </span>
          <h3>Invite friends to join at</h3>
          <p className="Blue">{url}</p>
        </div>
      </div>
    );
  }
);

InvitePopUp.displayName = "InviteComponent";
