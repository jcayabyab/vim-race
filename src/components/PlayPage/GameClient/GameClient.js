import React, { useState, useEffect, useCallback, useRef } from "react";
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
  ]);

  const handlePlayerFinish = useCallback(() => {
    socket.on("player finish", (data) => {
      setPlayerState(data.playerId, PLAYER_STATES.SUCCESS);
      // if (data.winnerId === user.id) {
      //   alert("You, " + (user.username || "player") + ", have won!");
      // } else {
      //   alert("You, " + (user.username || "player") + ", have lost!");
      // }
      if (data.playerId === user.id) {
        alert("You, " + (user.username || "player") + ", have won!");
        setClientState(GAME_STATES.IDLE);
      }
    });
  }, [socket, setClientState, user, setPlayerState]);

  const handleGameFinish = useCallback(() => {
    socket.on("game finish", () => {
      setPrevGameFinished(true);
    });
  }, [socket, setPrevGameFinished]);

  const handleSubmissionFail = useCallback(() => {
    socket.on("fail", (data) => {
      console.log("Bad submission by " + data.id + ": ", data.submission);
      if (data.id === user.id) {
        setDiff(data.diff);
      }
      setPlayerState(data.id, PLAYER_STATES.FAIL);
    });
  }, [socket, setDiff, setPlayerState, user]);

  const handleGameStart = useCallback(() => {
    socket.on("start", () => {
      console.log("start");
      setClientState(GAME_STATES.PLAYING);
    });
  }, [socket, setClientState]);

  const handleTerminalsLoaded = useCallback(() => {
    socket.emit("loaded", { id: user.id });
  }, [user, socket]);

  const sendSearchReqToSocket = useCallback(() => {
    socket.emit("request match", { id: user.id });
    setClientState(GAME_STATES.SEARCHING);
  }, [user, socket, setClientState]);

  const cancelMatchmaking = useCallback(() => {
    socket.emit("cancel matchmaking", { id: user.id });
    setClientState(GAME_STATES.IDLE);
  }, [user, socket, setClientState]);

  const sendSubmissionToSocket = useCallback(
    (id, submissionText) => {
      // only send to server if own user's submission - avoids double sending
      if (id === user.id) {
        socket.emit("validate", {
          id,
          submission: submissionText,
        });
      }
      // always set player state
      setPlayerState(id, PLAYER_STATES.VALIDATING);
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
  };
};

const usePlayerStates = () => {
  const [playerStates, setPlayerStates] = useState({});
  // handle previous logic for callbacks
  const prevRef = useRef();

  useEffect(() => {
    prevRef.current = playerStates;
  }, [playerStates]);

  const setPlayerState = useCallback(
    (id, newState, completionTime = null) => {
      const newPlayerState = { state: newState };
      // should only be defined when playerState === FINISHED
      if (completionTime) {
        newPlayerState.completionTime = completionTime;
      }
      setPlayerStates({ ...prevRef.current, [id]: newPlayerState });
    },
    [setPlayerStates, prevRef]
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

  console.log("gameclient", { clientState });

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
            onVimTerminalInit={() => setTerminalLoaded(true)}
            terminalLoaded={terminalLoaded}
            diff={diff}
            playerState={
              playerStates && user
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
            terminalLoaded={terminalLoaded}
            playerState={
              playerStates && opponent
                ? playerStates[opponent.id]
                : { state: PLAYER_STATES.PLAYING }
            }
            cancelMatchmaking={cancelMatchmaking}
            prevGameFinished={prevGameFinished}
          ></RightClient>
        </React.Fragment>
      )}
    </Wrapper>
  );
}
