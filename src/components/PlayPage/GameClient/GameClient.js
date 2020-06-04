import React, { useState, useEffect, useCallback } from "react";
import io from "socket.io-client";
import LeftClient from "./LeftClient";
import RightClient from "./RightClient";
import { useSelector } from "react-redux";
import STATES from "./states";
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
  setOpponent
) => {
  const handleMatchFound = useCallback(() => {
    socket.on("match found", (data) => {
      setClientState(STATES.LOADING);
      // set based on your own username
      setOpponent(data.player1.id === user.id ? data.player2 : data.player1);
      setStartText(data.startText);
      setGoalText(data.goalText);
    });
  }, [user, socket, setStartText, setGoalText, setClientState, setOpponent]);

  const handleMatchFinish = useCallback(() => {
    socket.on("finish", (data) => {
      if (data.winnerId === user.id) {
        alert("You, " + (user.username || "player") + ", have won!");
      } else {
        alert("You, " + (user.username || "player") + ", have lost!");
      }
      setClientState(STATES.IDLE);
    });
  }, [socket, setClientState, user]);

  const handleSubmissionFail = useCallback(() => {
    socket.on("fail", (data) => {
      console.log("Your bad submission: ", data.submission);
    });
  }, [socket]);

  const handleGameStart = useCallback(() => {
    socket.on("start", () => {
      setClientState(STATES.PLAYING);
    });
  }, [socket, setClientState]);

  const handleTerminalsLoaded = useCallback(() => {
    socket.emit("loaded", { id: user.id });
  }, [user, socket]);

  const sendSearchReqToSocket = useCallback(() => {
    socket.emit("request match", { id: user.id });
  }, [user, socket]);

  const sendSubmissionToSocket = useCallback(
    (submissionText) => {
      socket.emit("validate", {
        id: user.id,
        submission: submissionText,
      });
    },
    [user, socket]
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
      handleMatchFinish();
      handleSubmissionFail();
      handleGameStart();
      setSocketInitialized(true);
    }
  }, [
    socket,
    socketInitialized,
    setSocketInitialized,
    user,
    handleMatchFound,
    handleMatchFinish,
    handleSubmissionFail,
    handleGameStart,
  ]);

  return {
    handleMatchFound,
    handleMatchFinish,
    handleSubmissionFail,
    handleGameStart,
    handleTerminalsLoaded,
    sendSearchReqToSocket,
    sendSubmissionToSocket,
    handleKeystrokeReceived,
  };
};

export default function GameClient() {
  // change to username later
  const user = useSelector((state) => state.user);
  const [clientState, setClientState] = useState(STATES.IDLE);
  const [opponent, setOpponent] = useState(null);
  const [startText, setStartText] = useState(null);
  const [goalText, setGoalText] = useState(null);
  const [userInitialized, setUserInitialized] = useState(false);
  const [opponentInitialized, setOpponentInitialized] = useState(false);

  const [socket, socketInitialized, setSocketInitialized] = useSocket(
    "http://184.64.21.125:4001"
  );
  const {
    handleTerminalsLoaded,
    sendSearchReqToSocket,
    sendSubmissionToSocket,
    handleKeystrokeReceived,
  } = useSocketFunctions(
    socket,
    socketInitialized,
    setSocketInitialized,
    user,
    setClientState,
    setStartText,
    setGoalText,
    setOpponent
  );

  useEffect(() => {
    if (userInitialized && opponentInitialized) {
      handleTerminalsLoaded();
    }
  }, [userInitialized, opponentInitialized, handleTerminalsLoaded]);

  // reset after game ended
  useEffect(() => {
    if (clientState === STATES.IDLE) {
      setOpponent(null);
      setStartText(null);
      setGoalText(null);
      setUserInitialized(false);
      setOpponentInitialized(false);
    }
  }, [clientState, setUserInitialized, setOpponentInitialized]);

  const handleSearch = () => {
    if (user) {
      sendSearchReqToSocket();
      setClientState(STATES.SEARCHING);
    } else {
      console.log("user is not logged in");
    }
  };

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
          ></LeftClient>
          <RightClient
            socket={socket}
            opponent={opponent}
            startText={startText}
            gameState={clientState}
            handleSearch={handleSearch}
            handleClientInit={() => setOpponentInitialized(true)}
            handleKeystrokeReceived={handleKeystrokeReceived}
          ></RightClient>
        </React.Fragment>
      )}
    </Wrapper>
  );
}
