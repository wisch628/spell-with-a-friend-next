import { PopUp } from "./types";

export const BottomNav = ({
  notifications,
  togglePopUp,
}: {
  notifications: number;
  togglePopUp: (newPopup: PopUp) => void;
}) => {
  return (
    <nav className="bottom">
      <button
        className={notifications > 0 ? "notification" : ""}
        onClick={() => togglePopUp("chat")}
        data-count={notifications}
        onKeyDown={(event) => event.preventDefault()}
      >
        Chat Box
      </button>
    </nav>
  );
};
