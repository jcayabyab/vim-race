import React, { useState, useEffect, useCallback } from "react";
import useSocket from "./hooks/useSocket";
import useSocketFunctions from "./hooks/useSocketFunctions";
import usePlayerStates from "./hooks/usePlayerStates";
import LeftClient from "./LeftClient";
import RightClient from "./RightClient";
import { useSelector } from "react-redux";
import { GAME_STATES, PLAYER_STATES } from "./states";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
`;

export default function GameClient() {
  // change to username later
  const user = useSelector((state) => state.user);
  const [clientState, setClientState] = useState(GAME_STATES.IDLE);
  const [opponent, setOpponent] = useState(null);
  const [startText, setStartText] = useState(null);
  const [goalText, setGoalText] = useState(null);
  const [diff, setDiff] = useState([]);
  const [userInitialized, setUserInitialized] = useState(false);
  const [opponentInitialized, setOpponentInitialized] = useState(false);
  const [terminalLoaded, setTerminalLoaded] = useState(false);
  // used to stop timer once game is over
  const [prevGameFinished, setPrevGameFinished] = useState(false);

  const [socket, socketInitialized, setSocketInitialized] = useSocket(
    process.env.NODE_ENV === "production"
      ? "https://vimrace.herokuapp.com"
      : "http://192.168.0.24:4001"
  );

  const [playerStates, setNewPlayers, setPlayerState] = usePlayerStates();

  const {
    handleTerminalsLoaded,
    sendSearchReqToSocket,
    sendSubmissionToSocket,
    handleKeystrokeReceived,
    cancelMatchmaking,
    resignGame,
    handleVimKeydown,
  } = useSocketFunctions(
    socket,
    socketInitialized,
    setSocketInitialized,
    user,
    setClientState,
    setStartText,
    setGoalText,
    setDiff,
    setOpponent,
    setPlayerState,
    setNewPlayers,
    setPrevGameFinished
  );

  useEffect(() => {
    if (
      userInitialized &&
      opponentInitialized &&
      clientState === GAME_STATES.LOADING
    ) {
      handleTerminalsLoaded();
    }
  }, [
    userInitialized,
    opponentInitialized,
    handleTerminalsLoaded,
    clientState,
  ]);

  const handleSearch = () =>
    clientState === GAME_STATES.IDLE
      ? sendSearchReqToSocket()
      : cancelMatchmaking();

  // used to reset initialization variables when Vim component resets
  const handleUserUnmount = useCallback(() => setUserInitialized(false), [
    setUserInitialized,
  ]);
  const handleOpponentUnmount = useCallback(
    () => setOpponentInitialized(false),
    [setOpponentInitialized]
  );

  return (
    <Wrapper>
      {socketInitialized && (
        <React.Fragment>
          <LeftClient
            handleVimKeydown={handleVimKeydown}
            user={user}
            startText={startText}
            goalText={goalText}
            gameState={clientState}
            handleClientInit={() => setUserInitialized(true)}
            handleSubmission={sendSubmissionToSocket}
            handleKeystrokeReceived={handleKeystrokeReceived}
            // removeKeystrokeListeners={removeKeystrokeListeners}
            onVimTerminalInit={() => setTerminalLoaded(true)}
            terminalLoaded={terminalLoaded}
            diff={diff}
            playerState={
              playerStates && playerStates[user.id]
                ? playerStates[user.id]
                : { state: PLAYER_STATES.PLAYING }
            }
            handleUserUnmount={handleUserUnmount}
          ></LeftClient>
          <RightClient
            handleVimKeydown={handleVimKeydown}
            user={user}
            opponent={opponent}
            startText={startText}
            gameState={clientState}
            handleSubmission={sendSubmissionToSocket}
            handleSearch={handleSearch}
            handleClientInit={() => setOpponentInitialized(true)}
            handleKeystrokeReceived={handleKeystrokeReceived}
            terminalLoaded={terminalLoaded}
            playerStates={playerStates}
            cancelMatchmaking={cancelMatchmaking}
            prevGameFinished={prevGameFinished}
            resignGame={resignGame}
            handleOpponentUnmount={handleOpponentUnmount}
          ></RightClient>
        </React.Fragment>
      )}
    </Wrapper>
  );
}
