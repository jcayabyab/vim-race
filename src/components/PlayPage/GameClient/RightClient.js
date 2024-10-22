import React, { useContext, useCallback, useState, useEffect } from "react";
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
import MenuToggle from "./MenuToggle";

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px 25px;
`;

const Tooltip = styled.div`
  font-size: 10pt;
  height: 1em;
  margin-top: 3px;
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
    usersOnline,
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

  const [showChallenges, setShowChallenges] = useState(false);

  useEffect(() => {
    if (gameState !== GAME_STATES.IDLE) {
      setShowChallenges(false);
    }
  }, [gameState, setShowChallenges]);

  const renderGameMenu = () => {
    switch (gameState) {
      case GAME_STATES.LOADING:
        return (
          <React.Fragment>
            <div style={{ height: "320px" }}>
              <StatusScreen
                gameState={gameState}
                prevGameFinished={prevGameFinished}
                user={user}
                opponent={opponent}
                playerStates={playerStates}
                resignGame={resignGame}
              ></StatusScreen>
            </div>
            <Tooltip>Waiting for players to load...</Tooltip>
          </React.Fragment>
        );
      case GAME_STATES.PLAYING:
        return (
          <React.Fragment>
            <div style={{ height: "320px" }}>
              <StatusScreen
                gameState={gameState}
                prevGameFinished={prevGameFinished}
                user={user}
                opponent={opponent}
                playerStates={playerStates}
                resignGame={resignGame}
              ></StatusScreen>
            </div>
            <Tooltip>
              Use <code>:E</code> to submit your entry!
            </Tooltip>
          </React.Fragment>
        );
      case GAME_STATES.IDLE:
      case GAME_STATES.SEARCHING:
        return (
          <React.Fragment>
            <div style={{ height: "320px" }}>
              {showChallenges ? (
                <ChallengesScreen
                  style={{
                    borderBottom: "none",
                    borderBottomLeftRadius: "0px",
                    borderBottomRightRadius: "0px",
                  }}
                ></ChallengesScreen>
              ) : (
                <StatusScreen
                  gameState={gameState}
                  prevGameFinished={prevGameFinished}
                  user={user}
                  opponent={opponent}
                  playerStates={playerStates}
                  resignGame={resignGame}
                ></StatusScreen>
              )}
            </div>
            <MenuToggle
              onChallengeClick={() => setShowChallenges(true)}
              onGameStatusClick={() => setShowChallenges(false)}
              showChallenges={showChallenges}
            ></MenuToggle>
            <div>Users online: {usersOnline}</div>
          </React.Fragment>
        );
      default:
        return <div>Invalid state: {gameState}</div>;
    }
  };

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
          {renderGameMenu()}
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
          <div style={{ height: "320px", margin: "10px 0px" }}>
            <ChallengesScreen></ChallengesScreen>
          </div>
          <div>Users online: {usersOnline}</div>
        </React.Fragment>
      ) : (
        <div>Waiting for Vim terminal to download...</div>
      );
    }
  };

  return <Wrapper>{renderBody()}</Wrapper>;
}
