import Image from "next/image";
import { Dispatch, SetStateAction } from "react";

export const GameButtons = ({
  setOutside,
  deleteLetter,
  submitWord,
}: {
  setOutside: Dispatch<SetStateAction<string[]>>;
  deleteLetter: () => void;
  submitWord: () => Promise<void>;
}) => {
  const shuffleLetters = () => {
    setOutside((prev) => [...prev].sort(() => Math.random() - 0.5));
  };
  return (
    <div className="button_wrapper">
      <button className="thin_border_button" onClick={submitWord}>
        Enter
      </button>
      <Image
        onClick={shuffleLetters}
        src="/images/shuffle.png"
        alt="shuffle"
        height={30}
        width={30}
        className="shuffle"
      />
      <button className="thin_border_button" onClick={deleteLetter}>
        Delete
      </button>
    </div>
  );
};
