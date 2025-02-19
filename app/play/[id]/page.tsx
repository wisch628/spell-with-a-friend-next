"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Loading } from "./Loading";
import { GameUser, WordContainer, WordObject } from "./WordContainer";
import { GameData, PopUp } from "./types";
import { GameTopNav } from "./GameTopNav";
import { useParams } from "next/navigation";
import { callPostRoute, captialize } from "../../utils";
import {
  calculateScores,
  pangramCheck,
  setupSockets,
  wordErrorCheck,
} from "./utils";
import { toast, ToastContainer } from "react-toastify";
import { EMPTY_GAME_DATA, INVITE_FRIEND_ROUTE } from "./consts";
import { useRouter } from "next/navigation";
import { LeftContainer } from "./LeftContainer";
import { ChatBox, Message } from "../../components/ChatBox";
import { InvitePopUp } from "../../components/InvitePopup";

const Play = () => {
  const [gameData, setGameData] = useState<GameData>(EMPTY_GAME_DATA);
  const [users, setUsers] = useState<GameUser[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [foundWords, setFoundWords] = useState<WordObject[]>([]);
  const [player, setPlayer] = useState<GameUser | null>(null);
  const [popup, setPopup] = useState<PopUp>("");
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState(0);
  const [currentWord, setCurrentWord] = useState("");
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

  const prevUsersCount = useRef(users.length);

  const newUserJoined = useCallback((newUsers: GameUser[], message: string) => {
    if (newUsers.length > prevUsersCount.current) {
      setUsers(newUsers);
      prevUsersCount.current = newUsers.length;
      toast.info(message);
    }
  }, []);

  const setNewMessages = useCallback(
    (newMessages: Message[], currentPopUp: PopUp) => {
      if (newMessages.length === messages.length) return;
      const notificationCount = currentPopUp !== "chat" ? notifications + 1 : 0;
      setMessages(newMessages);
      setNotifications(notificationCount);
    },
    [messages.length, notifications]
  );

  const popupRef = useRef(popup);

  useEffect(() => {
    popupRef.current = popup;
    const length = messages.length;
    setupSockets(
      gameId,
      setFoundWords,
      (messages) => setNewMessages(messages, popupRef.current),
      newUserJoined,
      length
    );
  }, [gameId, newUserJoined, setNewMessages, popup, messages.length]);

  useEffect(() => {
    // Call the Python endpoint
    fetch(`/api/game/${gameId}`)
      .then((response) => response.json())
      .then((data) => {
        setFoundWords(data.words);
        setUsers(data.users);
      })
      .catch((error) => console.error("Error:", error));

    fetch(`/api/messages/${gameId}`)
      .then((response) => response.json())
      .then((data) => {
        setMessages(data.messages);
      })
      .catch((error) => console.error("Error:", error));
  }, [gameId]);

  const submitWord = useCallback(async () => {
    const { centerLetter, outerLetters, pangrams, answers } = gameData;
    const newWord = currentWord.toLowerCase();

    const errorMessage = wordErrorCheck({
      newWord,
      foundWords,
      centerLetter,
      outerLetters,
      answers,
    });
    if (errorMessage) {
      toast.error(errorMessage);
      return;
    }
    const isPangram = pangramCheck({ newWord, pangrams });
    if (isPangram) {
      toast.info("Pangram!");
    }
    const data = await callPostRoute(`/api/words/${gameId}`, {
      color: player?.color,
      word: newWord,
      isPangram,
    });
    setFoundWords(data.words);
    setCurrentWord("");
  }, [currentWord, foundWords, gameData, gameId, player?.color]);

  useEffect(() => {
    const handleTyping = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setPopup("");
        inputRef?.current?.focus();
        return;
      }
      if (popup !== "") return;
      if (event.key.length === 1 && event.key.match(/[a-zA-Z]/)) {
        setCurrentWord(currentWord + event.key);
      }
      if (event.key === "Backspace") {
        setCurrentWord(currentWord.slice(0, currentWord.length - 1));
      }
      if (event.key === "Enter" && !!currentWord?.length) {
        submitWord();
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
    document.addEventListener("keydown", handleTyping);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleTyping);
    };
  }, [popup, currentWord, submitWord]);

  useEffect(() => {
    if (!users.length) return;
    const savedName = localStorage.getItem(gameId as string);
    if (!savedName) {
      router.push(`${INVITE_FRIEND_ROUTE}${gameId}`);
    }
    const savedPlayer = users.find(
      ({ display_name }) => display_name === savedName
    ) as GameUser;
    setPlayer(savedPlayer);
  }, [users, gameId, router]);

  useEffect(() => {
    fetch(`/api/today`)
      .then((response) => response.json())
      .then((data) => {
        const letters = data.outerLetters.map((letter: string) =>
          letter.toUpperCase()
        );
        const centerLetter = data.centerLetter.toUpperCase();
        setGameData({ ...data, outerLetters: letters, centerLetter });
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  useEffect(() => {
    if (users?.length && gameData.outerLetters.length && player) {
      setLoading(false);
    }
  }, [users, gameData, player]);

  const score = useMemo(() => {
    return calculateScores(foundWords, scores);
  }, [foundWords, scores]);

  const togglePopUp = (newPopup: PopUp) => {
    if (newPopup == popup) {
      setPopup("");
    } else {
      if (newPopup === "chat") {
        setNotifications(0);
      }
      setPopup(newPopup);
    }
  };

  const resetFocus = () => {
    if (popup == "") {
      inputRef?.current?.focus();
    }
  };

  if (loading === true) {
    return <Loading />;
  } else {
    const style = { backgroundColor: "white" };
    return (
      <div style={style} onKeyDown={resetFocus} onClick={resetFocus}>
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
          <LeftContainer
            setCurrentWord={setCurrentWord}
            gameData={gameData}
            player={player as GameUser}
            setFoundWords={setFoundWords}
            foundWords={foundWords}
            currentWord={currentWord}
          />
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

          {popup === "chat" && (
            <ChatBox
              users={users}
              currentPlayer={player as GameUser}
              messages={messages}
            />
          )}
        </div>
      </div>
    );
  }
};

export default Play;
