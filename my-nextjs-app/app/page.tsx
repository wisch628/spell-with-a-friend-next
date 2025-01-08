import Link from "next/link";
import { Header } from "./home/Header";
import Image from "next/image";
import styling from "./home/home.module.css";

export default function Home() {
  const isLoggedIn = true;
  const firstName = "Hannah";
  return (
    <div className={styling.home}>
      <Header />
      <div>
        <Image
          src="/images/bee-clipart.png"
          alt="bee icon"
          width={100}
          height={100}
        />
        {/* {isLoggedIn ? ( */}
        <div>
          <h1>{`Welcome, ${firstName}!`}</h1>
          <h2>What would you like to do today?</h2>
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
        {/* // ) : (
            // <Login />        
            // ) */}
      </div>
      <footer>
        <p>
          Built by{" "}
          <a target="blank" href="https://www.linkedin.com/in/hannah-wischnia/">
            Hannah Wischnia
          </a>
        </p>
      </footer>
    </div>
  );
}
