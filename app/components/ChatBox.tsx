import React, { useEffect, useMemo, useRef, useState } from "react";
import { GameUser } from "../play/[id]/WordContainer";
import { callPostRoute } from "../utils";
import { useParams } from "next/navigation";

export interface Message {
  color: string;
  content: string;
  timestamp: string;
}

export const ChatBox = ({
  currentPlayer,
  users,
  messages,
}: {
  currentPlayer: GameUser;
  users: GameUser[];
  messages: Message[];
}) => {
  const params = useParams();
  const gameId = params.id as string;
  const messageRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.focus();
    }
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = async (event?: React.FormEvent) => {
    event?.preventDefault();
    await callPostRoute(`/api/messages/${gameId}`, {
      color: currentPlayer?.color,
      content: currentMessage,
    });
    setCurrentMessage("");
  };

  const [currentMessage, setCurrentMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const mappedUsers = useMemo(() => {
    const mapped: Record<string, string> = {};
    users.forEach(({ color, display_name }) => {
      mapped[color] = display_name;
    });
    return mapped;
  }, [users]);

  return (
    <div className="messageContainer">
      <div className="innerMessages">
        {messages.length > 0
          ? messages.map((message) =>
              message.color === currentPlayer.color ? (
                <div
                  key={message.timestamp}
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
                  key={message.timestamp}
                  className={["message", message.color].join(" ")}
                >
                  <h4>{mappedUsers[message.color]}</h4>
                  <p>{message.content}</p>
                </div>
              )
            )
          : null}
        <div
          style={{ float: "left", clear: "both", marginTop: "10px" }}
          ref={messagesEndRef}
        ></div>
      </div>
      <form
        id="new-message-form"
        className="new-message-form"
        onSubmit={sendMessage}
      >
        <input
          ref={messageRef}
          type="text"
          name="currentMessage"
          placeholder="Write your message"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          className="chatbox-input"
        />
        <span className="input-group-btn">
          <button id="chatButton" className="thin_border_button" type="submit">
            Send
          </button>
        </span>
      </form>
    </div>
  );
};
