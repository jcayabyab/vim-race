import React from "react";
import VimClient from "./VimClient";
import STATES from "./states";

export default function RightClient({
  socket,
  opponent,
  gameState,
  startText,
  handleSearch,
  handleClientInit,
}) {
  switch (gameState) {
    case STATES.IDLE:
      return <button onClick={handleSearch}>Search for game</button>;
    case STATES.SEARCHING:
      return <div>Waiting for opponent...</div>;
    case STATES.LOADING:
    case STATES.PLAYING:
      return (
        <div>
          <VimClient
            socket={socket}
            user={opponent}
            isEditable={false}
            startText={startText}
            handleClientInit={handleClientInit}
          ></VimClient>
        </div>
      );
    default:
      return <div>Error: {gameState}</div>;
  }
}
