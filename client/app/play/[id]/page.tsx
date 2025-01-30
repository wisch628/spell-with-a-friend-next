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
import { pangramCheck, wordErrorCheck } from "./utils";
import { ToastContainer, toast } from "react-toastify";

const Play = () => {
  const [gameData, setGameData] = useState<GameData>({
    outerLetters: [],
    centerLetter: "",
    displayDate: "",
    displayWeekday: "",
    answers: [],
    pangrams: [],
  });
  const [users, setUsers] = useState<GameUser[]>([]);
  const [foundWords, setFoundWords] = useState<WordObject[]>([]);
  const [player, setPlayer] = useState<GameUser | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { id: gameId } = useParams();

  const mappedUsers = useMemo(() => {
    return users.reduce((acc, users) => {
      acc[users.color] = 0;
      return acc;
    }, {} as { [key: string]: number });
  }, [users]);

  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8000/words/${gameId}`);

    socket.onopen = () => {
      console.log("WebSocket connection established");
    };

    socket.onmessage = (event) => {
      const json = JSON.parse(event.data);
      if (json.type === "new_word") {
        setFoundWords(json.words);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error: ", error);
    };

    // Cleanup on component unmount
    return () => {
      socket.close();
    };
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
        setLoading(false);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameData]);
  const [loading, setLoading] = useState(true);
  const [currentWord, setCurrentWord] = useState("");

  const score = useMemo(() => {
    const scores: { [key: string]: number } = {
      total: 0,
      ...mappedUsers,
    };
    foundWords.forEach((word) => {
      scores.total += word.points;
      scores[word.color] += word.points;
    });

    return scores;
  }, [foundWords, mappedUsers]);
  // Ensure the input is always focused when the component renders
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentWord]);

  const togglePopUp = () => {};

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

  if (loading === true) {
    return <Loading />;
  } else {
    const style = { backgroundColor: "white" };
    return (
      <div style={style} onKeyDown={() => inputRef?.current?.focus()}>
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
          {/* <button onClick={() => this.togglePopUp("chat")}>Chat Box</button> */}
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
          {/* {this.state.popUp === "chat" && (
            <ChatBox togglePopUp={() => this.togglePopUp("chat")} />
          )} */}
        </div>
      </div>
    );
  }
};

export default Play;
