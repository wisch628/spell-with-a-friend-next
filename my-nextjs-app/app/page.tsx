import Link from "next/link";
import Image from "next/image";
import styling from "@/components/home.module.css";
import { PageWrapper } from "@/components/PageWrapper";

export default function Home() {
  const isLoggedIn = true;
  const firstName = "Hannah";
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
            <h1>{`Welcome, ${firstName}`}</h1>
            <h2>It's time to start spelling with your friends!</h2>
            <div>
              <Link href="/new">
                <button>Create a New Game</button>
              </Link>
              <Link href="/join">
                <button>Join an Active Game</button>
              </Link>
              <Link href="/allgames">
                <button>Load Your Active Games</button>
              </Link>
            </div>
          </div>
        </div>
        {/* // ) : (
            // <Login />        
            // ) */}
      </div>
    </PageWrapper>
  );
}
