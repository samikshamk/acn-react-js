import "./App.css";
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

function Home() {
  const [text, setText] = useState("");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  });

  return (
    <div className="App">
      <header className="App-header">
        <NavLink to="/pokedex">
          <img
            hidden={!isReady}
            src="https://www.freeiconspng.com/uploads/file-pokeball-png-0.png"
            className="App-logo"
            alt="logo"
            style={{ padding: "10px" }}
          />
        </NavLink>
        <p>Are you ready to be a pokemon master? If YES, then type "Ready! to continue</p>
        <input
          type="text"
          name="name"
          onChange={(e) => setText(e.target.value)}
          value={text}
        />
        {text !== "Ready!" && (
          <span style={{ color: "red" }}>I am not ready yet!</span>
        )}
      </header>
    </div>
  );
}

export default Home;