import Image from "next/image";
import styles from "./home.module.css";

export const Header = () => {
  return (
    <nav className={styles.header}>
      <div>
        <p>Inspired By</p>
        <Image
          id="nylogo"
          src="/images/nyt-logo.png"
          alt="nytimes-logo"
          width={100}
          height={100}
        />
      </div>
      {/* {props.user.id && (
        <Link to="/" onClick={props.logOut}>
          Logout
        </Link>
      )} */}
    </nav>
  );
};
