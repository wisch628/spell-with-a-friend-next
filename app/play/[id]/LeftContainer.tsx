import { Letters } from "./Letters";
import {
  Dispatch,
  KeyboardEventHandler,
  RefObject,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { pangramCheck, wordErrorCheck } from "./utils";
import { callPostRoute } from "../../utils";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";
import { GameData } from "./types";
import { GameUser, WordObject } from "./WordContainer";

export const LeftContainer = ({
  gameData,
  foundWords,
  setFoundWords,
  player,
  inputRef,
  typingEnabled,
}: {
  gameData: GameData;
  foundWords: WordObject[];
  setFoundWords: Dispatch<SetStateAction<WordObject[]>>;
  player: GameUser;
  inputRef: RefObject<HTMLInputElement | null>;
  typingEnabled: boolean;
}) => {
  const [currentWord, setCurrentWord] = useState("");
  const params = useParams();
  const gameId = params.id;

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
      const data = await callPostRoute(`/api/words/${gameId}`, {
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
    if (typingEnabled) {
      inputRef?.current?.focus();
    } else {
      inputRef?.current?.blur();
    }
  }, [gameData, currentWord, inputRef, typingEnabled]);
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
