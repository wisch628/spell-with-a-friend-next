import { SetStateAction } from "react";
import { GameUser, WordObject } from "./WordContainer";
import { Message } from "@/components/ChatBox";
import { toast } from "react-toastify";



export const wordErrorCheck = ({foundWords, answers, newWord, centerLetter, outerLetters}: {foundWords: WordObject[]; answers: string[], newWord: string, centerLetter: string, outerLetters: string[]}) => {
    const string = centerLetter + outerLetters.join("");
    const regex = new RegExp(`^[${string}]*$`);
    if (newWord.length <= 3) {
      return "Too Short!";
    } else if (regex.test(newWord) === false) {
      return "Bad Letters!";
    } else if (newWord.includes(centerLetter) === false) {
      return "Missing center letter!";
    } else if (answers.indexOf(newWord) === -1) {
      return "Not in word list!!";
    } else if (foundWords.filter(({word}) => word === newWord).length > 0) {
      return "You already got that word!";
    }
    return ''
}

export const pangramCheck = ({newWord, pangrams}: {newWord: string, pangrams: string[]}) => {
      if (pangrams.includes(newWord)) {
        return true
      }
      return false
     
}

export const setupSockets = (gameId: string, setFoundWords: (value: SetStateAction<WordObject[]> ) => void, setMessages: (messages: Message[]) => void, setUsers: (messages: GameUser[]) => void) => {
      const socket = new WebSocket(`ws://localhost:8000/words/${gameId}`);
  
      socket.onopen = () => {
        console.log("WebSocket connection established");
      };
  
      socket.onmessage = (event) => {
        const json = JSON.parse(event.data);
        if (json.type === "new_word") {
          setFoundWords(json.words);
        }
        if (json.type === "new_message") {
          setMessages(json.messages);
        }
        if (json.type === "new_user") {
          setUsers(json.users);
          toast.info(json.message)
        } 
      };
  
      socket.onerror = (error) => {
        console.error("WebSocket error: ", error);
      };
  
      // Cleanup on component unmount
      return () => {
        socket.close();
      };
}

export const calculateScores = (foundWords: WordObject[], mappedUserScores: Record<string, number>) => {
      const scores: { [key: string]: number } = {
        total: 0,
        ...mappedUserScores,
      };
      foundWords.forEach((word) => {
        scores.total += word.points;
        scores[word.color] += word.points;
      });
  
      return scores;
}