import { Letters } from "./Letters";
import {
  Dispatch,
  KeyboardEventHandler,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { pangramCheck, wordErrorCheck } from "./utils";
import { callPostRoute } from "@/app/utils";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";
import { GameData } from "./types";
import { GameUser, WordObject } from "./WordContainer";

export const LeftContainer = ({
  gameData,
  foundWords,
  setFoundWords,
  player,
}: {
  gameData: GameData;
  foundWords: WordObject[];
  setFoundWords: Dispatch<SetStateAction<WordObject[]>>;
  player: GameUser;
}) => {
  const [currentWord, setCurrentWord] = useState("");
  const { gameId } = useParams();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const submitWord: KeyboardEventHandler<HTMLInputElement> = async (e) => {
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
      const data = await callPostRoute(`words/${gameId}`, {
        color: player?.color,
        word: newWord,
        isPangram,
      });
      setFoundWords(data.words);
      setCurrentWord("");
    }
  };
  const typeWord: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    setCurrentWord(e?.target?.value);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameData, currentWord]);
  return (
    <div className="left-container">
      <input
        ref={inputRef}
        placeholder="Type Your Word"
        name="currentWord"
        id="wordField"
        type="text"
        value={currentWord}
        onChange={typeWord}
        onKeyUp={submitWord}
      />
      <Letters
        gameData={gameData}
        onClickLetter={(letter: string) => setCurrentWord(currentWord + letter)}
      />
    </div>
  );
};
