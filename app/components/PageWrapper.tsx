import { ReactElement } from "react";
import { Header } from "./Header";

export const PageWrapper = ({ children }: { children: ReactElement }) => {
  return (
    <div className="home">
      <Header />
      {children}
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
};
