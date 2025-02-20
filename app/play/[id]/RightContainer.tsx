import { captialize } from "@/app/utils";
import { GameUser, WordContainer, WordObject } from "./WordContainer";
import { calculateScores } from "./utils";
import { useMemo } from "react";

export const RightContainer = ({
  users,
  foundWords,
}: {
  users: GameUser[];
  foundWords: WordObject[];
}) => {
  const [colorToUser, scores] = useMemo(() => {
    const colorToUser: Record<string, string> = {};
    const scores = users.reduce((acc, { color, display_name }) => {
      acc[color] = 0;
      colorToUser[color] = display_name;
      return acc;
    }, {} as { [key: string]: number });
    return [colorToUser, scores];
  }, [users]);
  const score = useMemo(() => {
    return calculateScores(foundWords, scores);
  }, [foundWords, scores]);
  return (
    <div className="right-container">
      <div className="score">
        {Object.keys(score).map((id) => {
          return (
            <p className={[id].join(" ")} key={id}>
              {`${captialize(id == "total" ? id : colorToUser[id])}: ${
                score[id]
              }`}
            </p>
          );
        })}
      </div>
      <WordContainer correctWords={foundWords} />
    </div>
  );
};
