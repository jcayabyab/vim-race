import React, { useContext, useCallback } from "react";
import VimClient from "./VimClient/VimClient";
import { GAME_STATES, PLAYER_STATES } from "./states";
import styled from "styled-components";
import { UserInfoHeader } from "./LeftClient";
import PlayerStateIcon from "./PlayerStateIcon";
import SearchButton from "./SearchButton";
import StatusScreen from "./StatusScreen/StatusScreen";
import { GameClientSocketFunctionsContext } from "./contexts/GameClientSocketFunctionsContext";
import { GameClientContext } from "./contexts/GameClientContext";
import { useSelector } from "react-redux";
import ChallengesScreen from "./ChallengesScreen/ChallengesScreen";

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

export default function RightClient() {
  const user = useSelector((state) => state.user);

  const {
    gameState,
    startText,
    opponent,
    lobbyTerminalLoaded,
    playerStates,
    prevGameFinished,
    setOpponentInitialized,
  } = useContext(GameClientContext);

  const {
    sendSubmissionToSocket,
    handleKeystrokeReceived,
    sendSearchReqToSocket,
    cancelMatchmaking,
    removeKeystrokeListeners,
    resignGame,
    handleVimKeydown,
  } = useContext(GameClientSocketFunctionsContext);

  const handleOpponentUnmount = useCallback(
    () => setOpponentInitialized(false),
    [setOpponentInitialized]
  );

  // The first game has started if startText is defined
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
                handleClientInit={() => setOpponentInitialized(true)}
                handleSubmission={sendSubmissionToSocket}
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
            resignGame={resignGame}
          ></StatusScreen>
        </React.Fragment>
      );
    } else {
      return lobbyTerminalLoaded ? (
        <React.Fragment>
          <SearchButton
            onSearch={sendSearchReqToSocket}
            onCancel={cancelMatchmaking}
            gameState={gameState}
          ></SearchButton>
          <ChallengesScreen></ChallengesScreen>
        </React.Fragment>
      ) : (
        <div>Waiting for Vim terminal to download...</div>
      );
    }
  };

  return <Wrapper>{renderBody()}</Wrapper>;
}
