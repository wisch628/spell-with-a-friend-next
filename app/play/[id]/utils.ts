import { SetStateAction } from "react";
import { WordObject } from "./WordContainer";
import { io } from "socket.io-client";
import { Message } from "../../components/ChatBox";
import { GameUser } from "../../types";

export const wordErrorCheck = ({
  foundWords,
  answers,
  newWord,
  centerLetter,
  outerLetters,
}: {
  foundWords: WordObject[];
  answers: string[];
  newWord: string;
  centerLetter: string;
  outerLetters: string[];
}) => {
  const string = centerLetter + outerLetters.join("");
  const regex = new RegExp(`^[${string}]*$`, "i");
  if (newWord.length <= 3) {
    return "Too Short!";
  } else if (regex.test(newWord) === false) {
    return "Bad Letters!";
  } else if (newWord.includes(centerLetter.toLowerCase()) === false) {
    return "Missing center letter!";
  } else if (answers.indexOf(newWord) === -1) {
    return "Not in word list!!";
  } else if (foundWords.filter(({ word }) => word === newWord).length > 0) {
    return "You already got that word!";
  }
  return "";
};

export const pangramCheck = ({
  newWord,
  pangrams,
}: {
  newWord: string;
  pangrams: string[];
}) => {
  if (pangrams.includes(newWord)) {
    return true;
  }
  return false;
};

export const setupSockets = (
  gameId: string,
  setFoundWords: (value: SetStateAction<WordObject[]>) => void,
  setMessages: (messages: Message[]) => void,
  newUserJoined: (users: GameUser[], message: string) => void,
  length = 0
) => {
  const socket = io();
  socket.on("connect", () => {
    console.log("WebSocket connection established");
    socket.emit("joinGame", gameId);
  });

  socket.on("new_word", (event) => {
    setFoundWords(event.words);
  });

  socket.on("new_message", (event) => {
    if (length === event.messages.length - 1) {
      setMessages(event.messages);
    }
  });

  socket.on("new_user", (event) => {
    newUserJoined(event.users, event.message);
  });

  socket.on("error", (error) => {
    console.error("WebSocket error: ", error);
  });

  // Cleanup on component unmount
  return () => {
    socket.close();
  };
};

export const calculateScores = (
  foundWords: WordObject[],
  mappedUserScores: Record<string, number>
) => {
  const scores: { [key: string]: number } = {
    total: 0,
    ...mappedUserScores,
  };
  foundWords.forEach((word) => {
    scores.total += word.points;
    scores[word.color] += word.points;
  });

  return scores;
};
