import React, { useState } from "react";
import NameInput from "./components/NameInput";
import GameClient from "./components/GameClient/GameClient";

function App() {
  const [username, setUsername] = useState(null);

  // old, sends by calling export and write
  // const sendFile = async (fullpath, contents) => {
  //   console.log(contents);
  //   const [bufId, buffer] = await vim2.worker.requestSharedBuffer(
  //     contents.byteLength
  //   );

  //   new Uint8Array(buffer).set(new Uint8Array(contents));

  //   vim2.worker.notifyOpenFileBufComplete("a", bufId);
  // };

  return (
    <div className="App">
      <NameInput onNameClick={(value) => setUsername(value)}></NameInput>
      <div>{username && "Current username: " + username}</div>
      <GameClient username={username}></GameClient>
    </div>
  );
}

export default App;
