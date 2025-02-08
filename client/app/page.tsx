import Link from "next/link";
import Image from "next/image";
import styling from "@/components/home.module.css";
import { PageWrapper } from "@/components/PageWrapper";
import { CreateNewGameButton } from "@/components/CreateNewGameButton";

export default function Home() {
  return (
    <PageWrapper>
      <div>
        <div className={styling.center}>
          <Image
            src="/images/double-bee.png"
            alt="bee icon"
            width={100}
            height={100}
          />
          {/* {isLoggedIn ? ( */}
          <div>
            <h1>Welcome to spell with a friend!</h1>
            <h2>Click below to get started</h2>
            <div>
              <CreateNewGameButton />
              <Link href="/join">
                <button>Join an Active Game</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
