import Link from "next/link";

export const CreateNewGameButton = () => {
  return (
    <Link href="/new">
      <button>Create a New Game</button>
    </Link>
  );
};
