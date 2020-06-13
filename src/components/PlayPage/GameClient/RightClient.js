import React from "react";
import VimClient from "./VimClient";
import { GAME_STATES, PLAYER_STATES } from "./states";
import styled from "styled-components";
import { UserInfoHeader } from "./LeftClient";
import PlayerStateIcon from "./PlayerStateIcon";
import SearchButton from "./SearchButton";
import StatusScreen from "./StatusScreen";

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px 25px;
`;

export default function RightClient({
  socket,
  user,
  opponent,
  gameState,
  startText,
  handleSearch,
  handleClientInit,
  handleKeystrokeReceived,
  terminalLoaded,
  playerStates,
  sendSubmissionToSocket,
  prevGameFinished,
}) {
  // used to check if a game has been played
  const gameStarted = !!startText;

  const renderBody = () => {
    if (gameStarted) {
      return (
        <React.Fragment>
          <UserInfoHeader>
            <div>
              {opponent && opponent.username
                ? opponent.username
                : "Unnamed user"}
            </div>
            <PlayerStateIcon
              problemState={
                playerStates && opponent
                  ? playerStates[opponent.id]
                  : { state: PLAYER_STATES.PLAYING }
              }
            ></PlayerStateIcon>
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
          {gameState === GAME_STATES.PLAYING && (
            <div>
              Use <code>:w</code> then <code>:export</code> to submit your
              entry!
            </div>
          )}
          {gameState === GAME_STATES.LOADING && (
            <div>Waiting for players to load...</div>
          )}
          <StatusScreen
            gameState={gameState}
            prevGameFinished={prevGameFinished}
            user={user}
            opponent={opponent}
            playerStates={playerStates}
          ></StatusScreen>
        </React.Fragment>
      );
    } else {
      return terminalLoaded ? (
        <SearchButton
          onClick={handleSearch}
          gameState={gameState}
        ></SearchButton>
      ) : (
        <div>Waiting for Vim terminal to download...</div>
      );
    }
  };

  return <Wrapper>{renderBody()}</Wrapper>;
}
