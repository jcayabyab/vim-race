import React from "react";
import VimClient from "./VimClient";
import STATES from "./states";
import styled from "styled-components";

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default function RightClient({
  socket,
  opponent,
  gameState,
  startText,
  handleSearch,
  handleClientInit,
  handleKeystrokeReceived,
}) {
  const renderBody = () => {
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
              gameState={gameState}
              handleKeystrokeReceived={handleKeystrokeReceived}
            ></VimClient>
          </div>
        );
      default:
        return <div>Error: {gameState}</div>;
    }
  };

  return <Wrapper>{renderBody()}</Wrapper>;
}
