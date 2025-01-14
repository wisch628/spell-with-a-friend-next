"use client";

import { KeyboardEventHandler, useEffect, useState } from "react";
import { Letters } from "./Letters";
import { Loading } from "./Loading";
import { WordContainer } from "./WordContainer";
import { GameData } from "./types";
import { GameTopNav } from "./GameTopNav";

const Play = () => {
  const [gameData, setGameData] = useState<GameData>({
    outerLetters: [],
    centerLetter: "",
    displayDate: "",
    displayWeekday: "",
  });
  useEffect(() => {
    // Call the Python endpoint
    fetch("http://127.0.0.1:8000/today")
      .then((response) => response.json())
      .then((data) => {
        setGameData(data);
        setLoading(false);
      })
      .catch((error) => console.error("Error:", error));
  }, []);
  const [loading, setLoading] = useState(true);
  const [currentWord, setCurrentWord] = useState("");
  const [score, setScore] = useState(0);

  const togglePopUp = () => {};

  const typeWord: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    setCurrentWord(e?.target?.value);
  };

  const checkWord: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      const newWord = currentWord.toLowerCase();
      setCurrentWord("");
    }
  };

  if (loading === true) {
    return <Loading />;
  } else {
    const style = { backgroundColor: "white" };
    return (
      <div style={style}>
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
        />
        <nav className="bottom">
          {/* <button onClick={() => this.togglePopUp("chat")}>Chat Box</button> */}
        </nav>
        {/* {this.state.popUp === "team" && (
          <TeamPopUp togglePopUp={this.togglePopUp} />
        )} */}
        <div className="flex">
          <WordContainer />
          <div className="left-container">
            <input
              placeholder="Type Your Word"
              name="currentWord"
              id="wordField"
              type="text"
              value={currentWord}
              onChange={typeWord}
              onKeyUp={checkWord}
            />
            <Letters gameData={gameData} />
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
