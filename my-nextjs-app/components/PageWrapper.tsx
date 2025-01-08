import { ReactElement } from "react";
import { Header } from "./Header";
import styling from "./home.module.css";

export const PageWrapper = ({ children }: { children: ReactElement }) => {
  return (
    <div className={styling.home}>
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
