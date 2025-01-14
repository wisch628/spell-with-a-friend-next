"use client";

import ColorSelector from "@/components/ColorSelector";
import { PageWrapper } from "@/components/PageWrapper";
import { useEffect } from "react";

const NewGame = () => {
  useEffect(() => {
    // Call the Python endpoint
    fetch("http://127.0.0.1:8000/today")
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((data) => console.log(data))
      .catch((error) => console.error("Error:", error));
  }, []);
  return (
    <PageWrapper>
      <div className="userLogin">
        <ColorSelector />
        <div>
          <button onClick={() => {}}>Create a Game</button>
        </div>
      </div>
    </PageWrapper>
  );
};

export default NewGame;
