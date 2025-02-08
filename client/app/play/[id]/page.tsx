"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Loading } from "./Loading";
import { GameUser, WordContainer, WordObject } from "./WordContainer";
import { GameData, PopUp } from "./types";
import { GameTopNav } from "./GameTopNav";
import { useParams } from "next/navigation";
import { captialize } from "@/app/utils";
import { calculateScores, setupSockets } from "./utils";
import { ToastContainer } from "react-toastify";
import { ChatBox, Message } from "@/components/ChatBox";
import { EMPTY_GAME_DATA } from "./consts";
import { InvitePopUp } from "@/components/InvitePopup";
import { useRouter } from "next/navigation";
import { LeftContainer } from "./LeftContainer";

const Play = () => {
  const [gameData, setGameData] = useState<GameData>(EMPTY_GAME_DATA);
  const [users, setUsers] = useState<GameUser[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [foundWords, setFoundWords] = useState<WordObject[]>([]);
  const [player, setPlayer] = useState<GameUser | null>(null);
  const [popup, setPopup] = useState<PopUp>("");
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState(0);
  const params = useParams();
  const router = useRouter();
  const teamPopupRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const gameId = params.id as string;

  const [colorToUser, scores] = useMemo(() => {
    const colorToUser: Record<string, string> = {};
    const scores = users.reduce((acc, { color, display_name }) => {
      acc[color] = 0;
      colorToUser[color] = display_name;
      return acc;
    }, {} as { [key: string]: number });
    return [colorToUser, scores];
  }, [users]);

  const setNewMessages = useCallback(
    (messages: Message[]) => {
      setMessages(messages);
      if (popup !== "chat") {
        setNotifications(notifications + 1);
      } else {
        setNotifications(0);
      }
    },
    [popup, notifications]
  );

  useEffect(() => {
    setupSockets(gameId, setFoundWords, setNewMessages);
  }, [gameId, setNewMessages]);
  useEffect(() => {
    // Call the Python endpoint
    fetch(`http://127.0.0.1:8000/game/${gameId}`)
      .then((response) => response.json())
      .then((data) => {
        setFoundWords(data.words);
        setUsers(data.users);
      })
      .catch((error) => console.error("Error:", error));
  }, [gameId]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setPopup("");
        inputRef?.current?.focus();
      }
    };
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popup == "invite" &&
        !teamPopupRef?.current?.contains(event.target as Node)
      ) {
        setPopup("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [popup]);

  useEffect(() => {
    if (!users.length) return;
    const savedName = localStorage.getItem(gameId as string);
    if (!savedName) {
      router.push(`/join?${gameId}`);
      return;
    }
    const savedPlayer = users.find(
      ({ display_name }) => display_name === savedName
    ) as GameUser;
    setPlayer(savedPlayer);
  }, [users, gameId, router]);

  useEffect(() => {
    // Call the Python endpoint
    fetch("http://127.0.0.1:8000/todaysData")
      .then((response) => response.json())
      .then((data) => {
        setGameData(data);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  useEffect(() => {
    if (users.length && gameData.outerLetters.length) {
      setLoading(false);
    }
  }, [users, gameData]);

  const score = useMemo(() => {
    return calculateScores(foundWords, scores);
  }, [foundWords, scores]);

  const togglePopUp = (newPopup: PopUp) => {
    if (newPopup == popup) {
      setPopup("");
    } else {
      if (newPopup === "chat") setNotifications(0);
      setPopup(newPopup);
    }
  };

  const typeWords = () => {
    if (popup == "") {
      inputRef?.current?.focus();
    }
  };

  if (loading === true) {
    return <Loading />;
  } else {
    const style = { backgroundColor: "white" };
    return (
      <div style={style} onKeyDown={typeWords}>
        <ToastContainer />
        {popup === "invite" && (
          <InvitePopUp
            ref={teamPopupRef}
            gameCode={gameId}
            togglePopup={() => togglePopUp("invite")}
          />
        )}
        <GameTopNav
          displayDate={gameData.displayDate}
          displayWeekday={gameData.displayWeekday}
          user={player as GameUser}
          togglePopUp={togglePopUp}
        />
        <nav className="bottom">
          <button
            className={notifications > 0 ? "notification" : ""}
            onClick={() => togglePopUp("chat")}
            data-count={notifications}
          >
            Chat Box
          </button>
        </nav>
        <div className="flex">
          <div className="right-container">
            <div className="score">
              {Object.keys(score).map((id) => {
                return (
                  <p className={[id].join(" ")} key={id}>
                    {`${captialize(id == "total" ? id : colorToUser[id])}: ${
                      score[id]
                    }`}
                  </p>
                );
              })}
            </div>
            <WordContainer correctWords={foundWords} />
          </div>
          <LeftContainer
            inputRef={inputRef}
            typingEnabled={popup === ""}
            gameData={gameData}
            player={player as GameUser}
            setFoundWords={setFoundWords}
            foundWords={foundWords}
          />

          {popup === "chat" && (
            <ChatBox
              users={users}
              currentPlayer={player as GameUser}
              messages={messages}
              setMessages={setMessages}
            />
          )}
        </div>
      </div>
    );
  }
};

export default Play;
