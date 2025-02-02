import React, { useMemo, useState } from "react";
import { GameUser } from "@/app/play/[id]/WordContainer";

interface Message {
  color: string;
  content: string;
}

export const ChatBox = ({
  currentPlayer,
  users,
}: {
  currentPlayer: GameUser;
  users: GameUser[];
}) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const messagesEndRef = React.createRef();
  const mappedUsers = useMemo(() => {
    const mapped: Record<string, string> = {};
    users.forEach(({ color, display_name }) => {
      mapped[color] = display_name;
    });
    return mapped;
  }, [users]);
  //   componentDidUpdate() {
  //     this.scrollToBottom("smooth");
  //   }
  //   async componentDidMount() {
  //     await this.props.fetchInitialMessages(Number(this.props.game.id));
  //     this.scrollToBottom("auto");
  //   }

  //   scrollToBottom = (behavior) => {
  //     this.messagesEnd.scrollIntoView({ behavior: behavior });
  //   };

  const messages: Message[] = [];
  return (
    <div className="messageContainer">
      <div className="innerMessages">
        {messages.length > 0
          ? messages.map((message) =>
              message.color === currentPlayer.color ? (
                <div
                  key={message.content}
                  className={[
                    "my-message",
                    "message",
                    currentPlayer.color,
                  ].join(" ")}
                >
                  <h4>You</h4>
                  <p>{message.content}</p>
                </div>
              ) : (
                <div
                  key={message.content}
                  className={["message", message.color].join(" ")}
                >
                  <h4>{mappedUsers[message.color]}</h4>
                  <p>{message.content}</p>
                </div>
              )
            )
          : null}
        <div
          style={{ float: "left", clear: "both" }}
          ref={(el) => {
            //   this.messagesEnd = el;
          }}
        ></div>
      </div>
      <form
        id="new-message-form"
        className="new-message-form"
        onSubmit={() => {}}
      >
        <input
          type="text"
          name="currentMessage"
          placeholder="Write your message"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
        />
        <span className="input-group-btn">
          <button id="chatButton" className="btn btn-default" type="submit">
            Send
          </button>
        </span>
      </form>
    </div>
  );
};
