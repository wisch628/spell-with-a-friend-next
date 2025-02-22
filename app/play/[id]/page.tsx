"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loading } from "./Loading";
import { WordObject } from "./WordContainer";
import { GameData, PopUp } from "./types";
import { GameTopNav } from "./GameTopNav";
import { useParams } from "next/navigation";
import { callPostRoute } from "../../utils";
import { pangramCheck, setupSockets, wordErrorCheck } from "./utils";
import { toast, ToastContainer } from "react-toastify";
import { EMPTY_GAME_DATA, INVITE_FRIEND_ROUTE } from "./consts";
import { useRouter } from "next/navigation";
import { LeftContainer } from "./LeftContainer";
import { ChatBox, Message } from "../../components/ChatBox";
import { InvitePopUp } from "../../components/InvitePopup";
import { RightContainer } from "./RightContainer";
import { BottomNav } from "./BottomNav";
import { GameUser } from "../../types";

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
        if (data.status === 400) {
          router.push(`/notFound`);
          return;
        }
        if (data.status === 410) {
          router.push(`/expired?gameCode=${gameId}`);
          return;
        }
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
  }, [gameId, router]);

  const submitWord = useCallback(async () => {
    if (!currentWord.length) return;
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

  const deleteLetter = useCallback(() => {
    setCurrentWord(currentWord.slice(0, currentWord.length - 1));
  }, [currentWord]);
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
        deleteLetter();
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
  }, [popup, currentWord, submitWord, deleteLetter]);

  useEffect(() => {
    if (!users.length) return;
    const savedName = localStorage.getItem(gameId as string)?.toLowerCase();
    if (!savedName) {
      router.push(`${INVITE_FRIEND_ROUTE}${gameId}`);
    }
    const savedPlayer = users.find(
      ({ display_name }) => display_name.toLowerCase() === savedName
    ) as GameUser;
    if (savedPlayer === undefined) {
      router.push(`/join?gameCode=${gameId}`);
    }
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
        {popup === "chat" && (
          <ChatBox
            users={users}
            currentPlayer={player as GameUser}
            messages={messages}
          />
        )}
        <GameTopNav
          displayDate={gameData.displayDate}
          displayWeekday={gameData.displayWeekday}
          user={player as GameUser}
          togglePopUp={togglePopUp}
        />
        <div className="flex">
          <RightContainer foundWords={foundWords} users={users} />
          <LeftContainer
            setCurrentWord={setCurrentWord}
            gameData={gameData}
            currentWord={currentWord}
            deleteLetter={deleteLetter}
            submitWord={submitWord}
          />
        </div>
        <BottomNav notifications={notifications} togglePopUp={togglePopUp} />
      </div>
    );
  }
};

export default Play;
