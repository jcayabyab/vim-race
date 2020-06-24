import React, { useState, useEffect, useCallback } from "react";
import io from "socket.io-client";
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

const useSocket = (endpoint) => {
  const [socket, setSocket] = useState(null);
  // ensures that "start" and "finish" socket listeners are only
  // established once
  const [socketInitialized, setSocketInitialized] = useState(false);

  useEffect(() => {
    if (!socket) {
      const newSocket = io(endpoint);
      setSocket(newSocket);
    }
    return () => {
      if (socket) socket.disconnect();
    };
  }, [socket, setSocket, endpoint]);

  return [socket, socketInitialized, setSocketInitialized];
};

const useSocketFunctions = (
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
) => {
  const handlePlayerFinish = useCallback(() => {
    socket.on("player finish", (data) => {
      let newState = PLAYER_STATES.SUCCESS;
      if (data.resigned) {
        newState = PLAYER_STATES.RESIGNED;
      }
      // if disconnected is found, then the player had not finished
      // the server does not send finish message for an already finished player
      else if (data.disconnected) {
        newState = PLAYER_STATES.DISCONNECTED;
      }

      // we want to read the current state of the player
      // if they have already resigned, then do not update as disconnected
      setPlayerState(
        data.playerId,
        newState,
        data.completionTime,
        data.placement
      );
      // if (data.winnerId === user.id) {
      //   alert("You, " + (user.username || "player") + ", have won!");
      // } else {
      //   alert("You, " + (user.username || "player") + ", have lost!");
      // }
      if (data.playerId === user.id) {
        setClientState(GAME_STATES.IDLE);
      }
    });
  }, [socket, setClientState, user, setPlayerState]);

  const handleGameFinish = useCallback(() => {
    socket.on("game finish", () => {
      // stop timer after 1 second
      setTimeout(() => {
        setPrevGameFinished(true);
      }, 1000);
    });
  }, [socket, setPrevGameFinished]);

  const handleSubmissionFail = useCallback(() => {
    socket.on("fail", (data) => {
      setPlayerState(data.id, PLAYER_STATES.FAIL);
      console.log("Bad submission by " + data.id + ": ", data.submission);
      if (data.id === user.id) {
        setDiff(data.diff);
      }
    });
  }, [socket, setDiff, setPlayerState, user]);

  const handleGameStart = useCallback(() => {
    socket.on("start", () => {
      setClientState(GAME_STATES.PLAYING);
    });
  }, [socket, setClientState]);

  const handleTerminalsLoaded = useCallback(() => {
    socket.emit("loaded", { id: user.id });
  }, [user, socket]);

  const sendSearchReqToSocket = useCallback(() => {
    setClientState(GAME_STATES.SEARCHING);
    socket.emit("request match", { id: user.id });
  }, [user, socket, setClientState]);

  const cancelMatchmaking = useCallback(() => {
    setClientState(GAME_STATES.IDLE);
    socket.emit("cancel matchmaking", { id: user.id });
  }, [user, socket, setClientState]);

  const resignGame = useCallback(() => {
    socket.emit("resign", { id: user.id });
  }, [user, socket]);

  const sendSubmissionToSocket = useCallback(
    (id, submissionText) => {
      // always set player state
      setPlayerState(id, PLAYER_STATES.VALIDATING);
      // only send to server if own user's submission - avoids double sending
      if (id === user.id) {
        socket.emit("validate", {
          id,
          submission: submissionText,
        });
      }
    },
    [user, socket, setPlayerState]
  );

  const handleKeystrokeReceived = useCallback(
    (handleKeystrokeEvent, terminalUser) => {
      socket.on("keystroke", (data) => {
        if (data.id === terminalUser.id) {
          handleKeystrokeEvent(data.event);
        }
      });
    },
    [socket]
  );

  const removeKeystrokeListeners = useCallback(() => {
    socket.removeAllListeners("keystroke");
  }, [socket]);

  const handleMatchFound = useCallback(() => {
    socket.on("match found", (data) => {
      setClientState(GAME_STATES.LOADING);
      // set based on your own username
      setOpponent(data.player1.id === user.id ? data.player2 : data.player1);
      // add players to playerState object
      setNewPlayers([data.player1.id, data.player2.id]);
      setStartText(data.startText);
      setGoalText(data.goalText);
      setDiff(data.diff);
      setPrevGameFinished(false);
      removeKeystrokeListeners();
    });
  }, [
    user,
    socket,
    setStartText,
    setGoalText,
    setDiff,
    setClientState,
    setOpponent,
    setNewPlayers,
    setPrevGameFinished,
    removeKeystrokeListeners,
  ]);

  // setup to listen for start and finish
  useEffect(() => {
    // socketIntialized to ensure these listeners are only defined once
    if (socket && !socketInitialized && user) {
      handleMatchFound();
      handlePlayerFinish();
      handleSubmissionFail();
      handleGameStart();
      setSocketInitialized(true);
      handleGameFinish();
    }
  }, [
    socket,
    socketInitialized,
    setSocketInitialized,
    user,
    handleMatchFound,
    handlePlayerFinish,
    handleSubmissionFail,
    handleGameStart,
    handleGameFinish,
  ]);

  return {
    handleMatchFound,
    handlePlayerFinish,
    handleSubmissionFail,
    handleGameStart,
    handleTerminalsLoaded,
    sendSearchReqToSocket,
    sendSubmissionToSocket,
    handleKeystrokeReceived,
    cancelMatchmaking,
    removeKeystrokeListeners,
    resignGame,
  };
};

const usePlayerStates = () => {
  const [playerStates, setPlayerStates] = useState({});
  // handle previous logic for callbacks

  const setPlayerState = useCallback(
    (id, newState, completionTime = null, placement = null) => {
      // handle race condition
      setPlayerStates((prevState) => {
        // if player already finished or resigned, do not update on disconnect
        if (
          prevState[id].state === PLAYER_STATES.SUCCESS ||
          prevState[id].state === PLAYER_STATES.RESIGNED
        ) {
          return prevState;
        } else {
          const newPlayerState = { state: newState, placement };
          if (
            newState === PLAYER_STATES.SUCCESS ||
            newState === PLAYER_STATES.RESIGNED
          ) {
            newPlayerState.completionTime = completionTime;
          }

          return { ...prevState, [id]: newPlayerState };
        }
      });
    },
    [setPlayerStates]
  );

  const setNewPlayers = useCallback(
    (ids) => {
      const newPlayerStates = {};
      ids.forEach(
        (id) => (newPlayerStates[id] = { state: PLAYER_STATES.PLAYING })
      );

      setPlayerStates(newPlayerStates);
    },
    [setPlayerStates]
  );

  return [playerStates, setNewPlayers, setPlayerState];
};

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

  // reset after game ended
  useEffect(() => {
    if (clientState === GAME_STATES.IDLE) {
      setUserInitialized(false);
      setOpponentInitialized(false);
    }
  }, [clientState, setUserInitialized, setOpponentInitialized]);

  return (
    <Wrapper>
      {socketInitialized && (
        <React.Fragment>
          <LeftClient
            socket={socket}
            user={user}
            startText={startText}
            goalText={goalText}
            gameState={clientState}
            handleClientInit={() => setUserInitialized(true)}
            sendSubmissionToSocket={sendSubmissionToSocket}
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
          ></LeftClient>
          <RightClient
            socket={socket}
            user={user}
            opponent={opponent}
            startText={startText}
            gameState={clientState}
            sendSubmissionToSocket={sendSubmissionToSocket}
            handleSearch={handleSearch}
            handleClientInit={() => setOpponentInitialized(true)}
            handleKeystrokeReceived={handleKeystrokeReceived}
            // removeKeystrokeListeners={removeKeystrokeListeners}
            terminalLoaded={terminalLoaded}
            playerStates={playerStates}
            cancelMatchmaking={cancelMatchmaking}
            prevGameFinished={prevGameFinished}
            resignGame={resignGame}
          ></RightClient>
        </React.Fragment>
      )}
    </Wrapper>
  );
}
