"use client";

import { KeyboardEventHandler, useEffect, useRef, useState } from "react";
import { Letters } from "./Letters";
import { Loading } from "./Loading";
import { GameUser, WordContainer, WordObject } from "./WordContainer";
import { GameData } from "./types";
import { GameTopNav } from "./GameTopNav";
import { useParams } from "next/navigation";

const Play = () => {
  const [gameData, setGameData] = useState<GameData>({
    outerLetters: [],
    centerLetter: "",
    displayDate: "",
    displayWeekday: "",
  });
  const [users, setUsers] = useState<GameUser[]>([]);
  const [words, setWords] = useState<WordObject[]>([]);
  const [player, setPlayer] = useState<GameUser | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { id: gameId } = useParams();
  useEffect(() => {
    // Call the Python endpoint
    fetch(`http://127.0.0.1:8000/game/${gameId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setWords(data.words);
        setUsers(data.users);
      })
      .catch((error) => console.error("Error:", error));
  }, [gameId]);

  useEffect(() => {
    if (!users) return;
    const savedName = localStorage.getItem(gameId as string);
    const savedPlayer = users.find(
      ({ display_name }) => display_name === savedName
    );
    setPlayer(savedPlayer);
    console.log(savedPlayer);
  }, [users, gameId]);

  useEffect(() => {
    // Call the Python endpoint
    fetch("http://127.0.0.1:8000/todaysData")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setGameData(data);
        setLoading(false);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      console.log("does input ref exist");
    }
  }, [gameData]);
  const [loading, setLoading] = useState(true);
  const [currentWord, setCurrentWord] = useState("");
  const [score, setScore] = useState(0);

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
      const newWord = currentWord.toLowerCase();
      const response = await fetch(`http://localhost:8000/words/${gameId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          color: player?.color,
          word: newWord,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(words);
          setWords(data.words);
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
          <WordContainer correctWords={words} gameUsers={users} />
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
