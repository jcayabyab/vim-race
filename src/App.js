import React, { useState } from "react";
import NameInput from "./components/NameInput";
import GameClient from "./components/GameClient/GameClient";

function App() {
  const [username, setUsername] = useState(null);

  return (
    <div className="App">
      <NameInput onNameClick={(value) => setUsername(value)}></NameInput>
      <div>{username && "Current username: " + username}</div>
      <GameClient username={username}></GameClient>
    </div>
  );
}

export default App;
