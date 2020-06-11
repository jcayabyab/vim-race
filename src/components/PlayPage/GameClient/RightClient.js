import React from "react";
import VimClient from "./VimClient";
import { GAME_STATES } from "./states";
import styled from "styled-components";
import { UserInfoHeader } from "./LeftClient";
import PlayerStateIcon from "./PlayerStateIcon";
import SearchButton from "./SearchButton";

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px 25px;
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
      case GAME_STATES.SEARCHING:
        return terminalLoaded ? (
          <SearchButton onClick={handleSearch} gameState={gameState}></SearchButton>
        ) : (
          <div>Waiting for Vim terminal to download...</div>
        );
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
            {gameState === GAME_STATES.PLAYING ? (
              <div>
                Use <code>:w</code> then <code>:export</code> to submit your
                entry!
              </div>
            ) : (
              <div>Waiting for players to load...</div>
            )}
          </React.Fragment>
        );
      default:
        return <div>Error: {gameState}</div>;
    }
  };

  return <Wrapper>{renderBody()}</Wrapper>;
}
