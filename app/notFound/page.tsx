import { ErrorPage } from "../components/ErrorPage";

const GameNotFound = () => {
  return (
    <ErrorPage errorMessage="Sorry, that game does not exist. You can create a new game below!" />
  );
};

export default GameNotFound;
