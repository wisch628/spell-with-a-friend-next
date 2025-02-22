import Image from "next/image";
import { CreateNewGameButton } from "./CreateNewGameButton";
import { PageWrapper } from "./PageWrapper";

export const ErrorPage = ({ errorMessage }: { errorMessage: string }) => {
  return (
    <PageWrapper>
      <div>
        <Image
          src="/images/crying_bee.png"
          alt="sad bee"
          width={100}
          height={100}
        />
        <p>{errorMessage}</p>
        <CreateNewGameButton />
      </div>
    </PageWrapper>
  );
};
