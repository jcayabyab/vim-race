import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import VimClient from "./VimClient";
import { useSelector } from "react-redux";
import styled from "styled-components";

const ClientComponent = styled.div`
  
`

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
  const username = useSelector((state) => state.user.id);
  console.log(username);
  const [clientState, setClientState] = useState("PLAYING");
  const [opponentName, setOpponentName] = useState(null);
  const [startText, setStartText] = useState(null);
  const [goalText, setGoalText] = useState(null);
  const [STATES] = useState({
    IDLE: "IDLE",
    SEARCHING: "SEARCHING",
    PLAYING: "PLAYING",
  });

  const [socket, socketInitialized, setSocketInitialized] = useSocket(
    "http://184.64.21.125:4001"
  );

  // setup to listen for start and finish
  useEffect(() => {
    if (socket && !socketInitialized && username) {
      socket.on("start", (data) => {
        setClientState(STATES.PLAYING);
        // set based on your own username
        setOpponentName(
          data.player1 === username ? data.player2 : data.player1
        );
        setStartText(data.startText);
        setGoalText(data.goalText);
      });
      socket.on("finish", (data) => {
        console.log(data.winner);
        if (data.winner === username) {
          alert("You, " + username + ", have won!");
        } else {
          alert("You, " + username + ", have lost!");
        }
        setClientState(STATES.IDLE);
      });
      socket.on("fail", (data) => {
        console.log("Your bad submission: ", data.submission);
      });

      setSocketInitialized(true);
    }
  }, [
    STATES,
    socket,
    socketInitialized,
    setSocketInitialized,
    setOpponentName,
    username,
  ]);

  const handleSearch = () => {
    if (username) {
      socket.emit("request match", { username });
      setClientState(STATES.SEARCHING);
    } else {
      console.log("username not established");
    }
  };

  switch (clientState) {
    case STATES.IDLE:
      return (
        <div>
          <div>Idle</div>
          {username && <button onClick={handleSearch}>Search for game</button>}
        </div>
      );
    case STATES.SEARCHING:
      return <div>Waiting for opponent...</div>;
    case STATES.PLAYING:
      return (
        <ClientComponent>
          <VimClient
            socket={socket}
            isEditable={true}
            username={username}
            startText={startText}
            goalText={goalText}
          ></VimClient>
          <VimClient
            socket={socket}
            isEditable={false}
            username={opponentName}
            startText={startText}
            goalText={goalText}
            scale={0.7}
          ></VimClient>
          <div>Goal:</div>
          <div
            style={{
              whiteSpace: "pre-wrap",
              fontFamily: "Consolas, monospace",
            }}
          >
            {goalText}
          </div>
        </ClientComponent>
      );
    default:
      return <div>{clientState}</div>;
  }
}
