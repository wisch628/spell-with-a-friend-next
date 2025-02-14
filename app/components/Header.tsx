import Image from "next/image";

export const Header = () => {
  return (
    <nav className="header">
      <div>
        <p>Inspired By</p>
        <Image
          id="nylogo"
          src="/images/nyt-logo.png"
          alt="nytimes-logo"
          width={100}
          height={25.39}
        />
      </div>
    </nav>
  );
};
