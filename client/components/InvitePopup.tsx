export const InvitePopUp = ({
  togglePopup,
  gameCode,
}: {
  gameCode: string;
  togglePopup: () => void;
}) => {
  const url = `www.${window.location.host}/join?game=${gameCode}`;
  return (
    <div className="modal">
      <div className="modal_content">
        <span className="close" onClick={togglePopup}>
          &times;
        </span>
        <h3>Invite friends to join at</h3>
        <p className="Blue">{url}</p>
      </div>
    </div>
  );
};
