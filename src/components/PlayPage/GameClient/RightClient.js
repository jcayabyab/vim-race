import React from "react";
import VimClient from "./VimClient";
import STATES from "./states";
import styled from "styled-components";

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px 25px;
`;

// custom border
const SearchButton = styled.button`
  position: relative;
  border: 1px solid black;
  border-radius: 3px;
  background-color: #d1d1d1;
  padding: 20px;
  font-size: 20pt;
  color: black;
  cursor: pointer;
  width: 100%;
`;

export default function RightClient({
  socket,
  opponent,
  gameState,
  startText,
  handleSearch,
  handleClientInit,
  handleKeystrokeReceived,
  terminalLoaded
}) {
  const renderBody = () => {
    switch (gameState) {
      case STATES.IDLE:
        return terminalLoaded ? (
          <SearchButton onClick={handleSearch}>Search for game</SearchButton>
        ) : (
          <div>Waiting for Vim terminal to download...</div>
        );
      case STATES.SEARCHING:
        return <div>Waiting for opponent...</div>;
      case STATES.LOADING:
      case STATES.PLAYING:
        return (
          <VimClient
            socket={socket}
            user={opponent}
            isEditable={false}
            startText={startText}
            handleClientInit={handleClientInit}
            gameState={gameState}
            handleKeystrokeReceived={handleKeystrokeReceived}
          ></VimClient>
        );
      default:
        return <div>Error: {gameState}</div>;
    }
  };

  return <Wrapper>{renderBody()}</Wrapper>;
}
