import { useCallback, useEffect, useContext, useState } from "react";
import { GAME_STATES, PLAYER_STATES } from "../states";
import { GameClientContext } from "../contexts/GameClientContext";

// requires GameClientStateProvider as a parent
const useGameClientSocketFunctions = (socket, user) => {
  const gameClientState = useContext(GameClientContext);
  const {
    userInitialized,
    opponentInitialized,
    gameState,
    setLoginDetected,
    setServerDisconnected,
    setGameState,
    setStartText,
    setGoalText,
    setDiff,
    setOpponent,
    setPlayerState,
    setNewPlayers,
    setPrevGameFinished,
    setUsersOnline,
  } = gameClientState;

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
        setGameState(GAME_STATES.IDLE);
      }
    });
  }, [socket, setGameState, user, setPlayerState]);

  const handleGameFinish = useCallback(() => {
    socket.on("game finish", () => {
      // stop timer after 1 second
      setTimeout(() => {
        setPrevGameFinished(true);
      }, 1000);
    });
  }, [socket, setPrevGameFinished]);

  // logic for grabbing event info from event and passing to server
  const handleVimKeydown = useCallback(
    (e) => {
      e.preventDefault();
      const { key, keyCode, code, ctrlKey, shiftKey, altKey, metaKey } = e;
      socket.emit("keystroke", {
        event: {
          key,
          keyCode,
          code,
          ctrlKey,
          shiftKey,
          altKey,
          metaKey,
        },
        id: user.id,
      });
      // client side validation
      // vim.cmdline("export submission");
    },
    [user, socket]
  );

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
      setGameState(GAME_STATES.PLAYING);
    });
  }, [socket, setGameState]);

  const handleAlreadyLoggedIn = useCallback(() => {
    socket.on("login detected", () => {
      setLoginDetected(true);
      // disconnect from socket
      socket.disconnect();
    });
  }, [socket, setLoginDetected]);

  const handleServerDisconnect = useCallback(() => {
    socket.on("disconnect", () => {
      setServerDisconnected(true);
    });
  }, [socket, setServerDisconnected]);

  const handleUpdateUsersOnline = useCallback(() => {
    socket.on("users online", (usersOnline) => {
      setUsersOnline(usersOnline);
    });
  }, [socket, setUsersOnline]);

  const handleTerminalsLoaded = useCallback(() => {
    socket.emit("loaded", { id: user.id });
  }, [user, socket]);

  const sendSearchReqToSocket = useCallback(() => {
    setGameState(GAME_STATES.SEARCHING);
    socket.emit("request match", { id: user.id });
  }, [user, socket, setGameState]);

  const cancelMatchmaking = useCallback(() => {
    setGameState(GAME_STATES.IDLE);
    socket.emit("cancel matchmaking", { id: user.id });
  }, [user, socket, setGameState]);

  const resignGame = useCallback(() => {
    socket.emit("resign", { id: user.id });
  }, [user, socket]);

  const sendSubmissionToSocket = useCallback(
    (terminalUser, submissionText) => {
      const id = terminalUser.id;
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
      setGameState(GAME_STATES.LOADING);
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
    setGameState,
    setOpponent,
    setNewPlayers,
    setPrevGameFinished,
    removeKeystrokeListeners,
  ]);

  const handleHandshake = useCallback(() => {
    socket.emit("handshake", { id: user.id });
  }, [user, socket]);

  // ensures that "start" and "finish" socket listeners are only
  // established once
  const [functionsInitialized, setFunctionsInitialized] = useState(false);

  // trigger game start when terminals are loaded
  useEffect(() => {
    if (
      userInitialized &&
      opponentInitialized &&
      gameState === GAME_STATES.LOADING
    ) {
      handleTerminalsLoaded();
    }
  }, [userInitialized, opponentInitialized, handleTerminalsLoaded, gameState]);

  // setup to listen for start and finish
  useEffect(() => {
    if (socket && !functionsInitialized && user) {
      handleMatchFound();
      handlePlayerFinish();
      handleSubmissionFail();
      handleGameStart();
      handleGameFinish();
      handleHandshake();
      handleAlreadyLoggedIn();
      handleServerDisconnect();
      handleUpdateUsersOnline();
      setFunctionsInitialized(true);
    }
  }, [
    socket,
    functionsInitialized,
    setFunctionsInitialized,
    user,
    handleMatchFound,
    handlePlayerFinish,
    handleSubmissionFail,
    handleGameStart,
    handleGameFinish,
    handleHandshake,
    handleAlreadyLoggedIn,
    handleServerDisconnect,
    handleUpdateUsersOnline,
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
    handleVimKeydown,
  };
};

export default useGameClientSocketFunctions;
