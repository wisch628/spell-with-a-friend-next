"use client";

import {
  KeyboardEventHandler,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Letters } from "./Letters";
import { Loading } from "./Loading";
import { GameUser, WordContainer, WordObject } from "./WordContainer";
import { GameData } from "./types";
import { GameTopNav } from "./GameTopNav";
import { useParams } from "next/navigation";
import { captialize } from "@/app/utils";
import {
  calculateScores,
  pangramCheck,
  setupSockets,
  wordErrorCheck,
} from "./utils";
import { ToastContainer, toast } from "react-toastify";
import { ChatBox } from "@/components/ChatBox";
import { EMPTY_GAME_DATA } from "./consts";

const Play = () => {
  const [gameData, setGameData] = useState<GameData>(EMPTY_GAME_DATA);
  const [users, setUsers] = useState<GameUser[]>([]);
  const [foundWords, setFoundWords] = useState<WordObject[]>([]);
  const [player, setPlayer] = useState<GameUser | null>(null);
  const [popup, setPopup] = useState<"chat" | "">("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const params = useParams();
  const gameId = params.id as string;

  const mappedUserScores = useMemo(() => {
    return users.reduce((acc, users) => {
      acc[users.color] = 0;
      return acc;
    }, {} as { [key: string]: number });
  }, [users]);

  useEffect(() => {
    setupSockets(gameId, setFoundWords);
  }, [gameId]);
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
    if (!users.length) return;
    const savedName = localStorage.getItem(gameId as string);
    const savedPlayer = users.find(
      ({ display_name }) => display_name === savedName
    ) as GameUser;
    setPlayer(savedPlayer);
  }, [users, gameId]);

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

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameData]);
  const [loading, setLoading] = useState(true);
  const [currentWord, setCurrentWord] = useState("");

  const score = useMemo(() => {
    return calculateScores(foundWords, mappedUserScores);
  }, [foundWords, mappedUserScores]);
  // Ensure the input is always focused when the component renders
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentWord]);

  const typeWord: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    setCurrentWord(e?.target?.value);
  };

  const checkWord: KeyboardEventHandler<HTMLInputElement> = async (e) => {
    if (e.key === "Enter") {
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
        setCurrentWord("");
        return;
      }
      const isPangram = pangramCheck({ newWord, pangrams });
      if (isPangram) {
        toast.info("Pangram!");
      }
      await fetch(`http://localhost:8000/words/${gameId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          color: player?.color,
          word: newWord,
          isPangram,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setFoundWords(data.words);
        });
      setCurrentWord("");
    }
  };

  const togglePopUp = () => {
    if (popup === "chat") {
      setPopup("");
    } else {
      setPopup("chat");
    }
  };

  const typeWords = () => {
    if (popup !== "chat") {
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
        {/* {this.state.popUp === "seen" && (
          <InvitePopUp togglePopUp={this.togglePopUp} />
        )} */}
        {/* {this.state.popUp === "sideMenu" && (
          <TabletMenu togglePopUp={this.togglePopUp} classProp="in" />
        )}{" "} */}
        {/* {this.state.popUp === "out" && (
          <TabletMenu classProp="out" togglePopUp={this.togglePopUp} />
        )} */}
        <GameTopNav
          displayDate={gameData.displayDate}
          displayWeekday={gameData.displayWeekday}
          user={player as GameUser}
        />
        <nav className="bottom">
          <button onClick={togglePopUp}>Chat Box</button>
        </nav>
        {/* {this.state.popUp === "team" && (
          <TeamPopUp togglePopUp={this.togglePopUp} />
        )} */}
        <div className="flex">
          <div>
            <div className="score">
              {Object.keys(score).map((color) => {
                return (
                  <p className={["correct", color].join(" ")} key={color}>
                    {`${captialize(color)}: ${score[color]}`}
                  </p>
                );
              })}
            </div>
            <WordContainer correctWords={foundWords} />
          </div>
          <div className="left-container">
            <input
              ref={inputRef}
              placeholder="Type Your Word"
              name="currentWord"
              id="wordField"
              type="text"
              value={currentWord}
              onChange={typeWord}
              onKeyUp={checkWord}
            />
            <Letters
              gameData={gameData}
              onClickLetter={(letter: string) =>
                setCurrentWord(currentWord + letter)
              }
            />
          </div>
          {popup === "chat" && (
            <ChatBox users={users} currentPlayer={player as GameUser} />
          )}
        </div>
      </div>
    );
  }
};

export default Play;
