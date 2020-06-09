import React from "react";
import VimClient from "./VimClient";
import { GAME_STATES } from "./states";
import styled from "styled-components";
import { UserInfoHeader } from "./LeftClient";
import PlayerStateIcon from "./PlayerStateIcon";

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
  terminalLoaded,
  playerState,
  sendSubmissionToSocket,
}) {
  const renderBody = () => {
    switch (gameState) {
      case GAME_STATES.IDLE:
        return terminalLoaded ? (
          <SearchButton onClick={handleSearch}>Search for game</SearchButton>
        ) : (
          <div>Waiting for Vim terminal to download...</div>
        );
      case GAME_STATES.SEARCHING:
        return <div>Waiting for opponent...</div>;
      case GAME_STATES.LOADING:
      case GAME_STATES.PLAYING:
        return (
          <React.Fragment>
            <UserInfoHeader>
              <div>
                {opponent && opponent.username
                  ? opponent.username
                  : "Unnamed user"}
              </div>
              <PlayerStateIcon problemState={playerState}></PlayerStateIcon>
            </UserInfoHeader>
            {
              /* delay to ensure opponent info is loaded */
              !!opponent && (
                <VimClient
                  socket={socket}
                  user={opponent}
                  isEditable={false}
                  startText={startText}
                  handleClientInit={handleClientInit}
                  sendSubmissionToSocket={sendSubmissionToSocket}
                  gameState={gameState}
                  handleKeystrokeReceived={handleKeystrokeReceived}
                ></VimClient>
              )
            }
            <div>
              Use <code>:w</code> then <code>:export</code> to submit your
              entry!
            </div>
          </React.Fragment>
        );
      default:
        return <div>Error: {gameState}</div>;
    }
  };

  return <Wrapper>{renderBody()}</Wrapper>;
}
