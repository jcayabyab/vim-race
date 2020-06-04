import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import LeftClient from "./LeftClient";
import RightClient from "./RightClient";
import { useSelector } from "react-redux";
import STATES from "./states";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
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

  // setup to listen for start and finish
  useEffect(() => {
    if (socket && !socketInitialized && user) {
      socket.on("match found", (data) => {
        setClientState(STATES.LOADING);
        // set based on your own username
        setOpponent(data.player1.id === user.id ? data.player2 : data.player1);
        setStartText(data.startText);
        setGoalText(data.goalText);
      });
      socket.on("finish", (data) => {
        if (data.winnerId === user.id) {
          alert("You, " + (user.username || "player") + ", have won!");
        } else {
          alert("You, " + (user.username || "player") + ", have lost!");
        }
        setClientState(STATES.IDLE);
      });
      socket.on("fail", (data) => {
        console.log("Your bad submission: ", data.submission);
      });
      socket.on("start", () => {
        console.log("start");
        setClientState(STATES.PLAYING);
      });

      setSocketInitialized(true);
    }
  }, [socket, socketInitialized, setSocketInitialized, setOpponent, user]);

  useEffect(() => {
    console.log({userInitialized, opponentInitialized})
    if (userInitialized && opponentInitialized) {
      socket.emit("loaded", { id: user.id });
    }
  }, [socket, userInitialized, user, opponentInitialized]);

  const handleSearch = () => {
    console.log(user);
    if (user) {
      socket.emit("request match", { id: user.id });
      setClientState(STATES.SEARCHING);
    } else {
      console.log("username not established");
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
          ></LeftClient>
          <RightClient
            socket={socket}
            opponent={opponent}
            startText={startText}
            gameState={clientState}
            handleSearch={handleSearch}
            handleClientInit={() => setOpponentInitialized(true)}
          ></RightClient>
        </React.Fragment>
      )}
    </Wrapper>
  );
}
