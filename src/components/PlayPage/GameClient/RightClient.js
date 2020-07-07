import React from "react";
import VimClient from "./VimClient/VimClient";
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

const Tooltip = styled.div`
  visibility: ${({ visible }) => (visible ? "visible" : "hidden")};
`;

export default function RightClient({
  handleVimKeydown,
  user,
  opponent,
  gameState,
  startText,
  handleSearch,
  handleClientInit,
  handleKeystrokeReceived,
  terminalLoaded,
  playerStates,
  handleSubmission,
  prevGameFinished,
  removeKeystrokeListeners,
  resignGame,
  handleOpponentUnmount,
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
              playerState={
                playerStates && playerStates[opponent.id]
                  ? playerStates[opponent.id]
                  : { state: PLAYER_STATES.PLAYING }
              }
            ></PlayerStateIcon>
          </UserInfoHeader>
          {
            /* delay to ensure opponent info is loaded */
            !!opponent && (
              <VimClient
                handleVimKeydown={handleVimKeydown}
                user={opponent}
                isEditable={false}
                startText={startText}
                handleClientInit={handleClientInit}
                handleSubmission={handleSubmission}
                gameState={gameState}
                handleKeystrokeReceived={handleKeystrokeReceived}
                removeKeystrokeListeners={removeKeystrokeListeners}
                handleUnmount={handleOpponentUnmount}
              ></VimClient>
            )
          }
          <Tooltip visible={gameState === GAME_STATES.PLAYING}>
            Use <code>:E</code> to submit your entry!
          </Tooltip>
          {gameState === GAME_STATES.LOADING && (
            <div>Waiting for players to load...</div>
          )}
          <StatusScreen
            gameState={gameState}
            prevGameFinished={prevGameFinished}
            user={user}
            opponent={opponent}
            playerStates={playerStates}
            handleSearch={handleSearch}
            resignGame={resignGame}
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
