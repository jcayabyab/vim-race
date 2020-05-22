import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import VimClient from "./VimClient";

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

export default function GameClient({ username }) {
  const [clientState, setClientState] = useState("IDLE");
  const [opponentName, setOpponentName] = useState(null);
  const [STATES] = useState({
    IDLE: "IDLE",
    SEARCHING: "SEARCHING",
    PLAYING: "PLAYING",
  });

  const [socket, socketInitialized, setSocketInitialized] = useSocket(
    "http://192.168.0.24:4001"
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
      });
      socket.on("finish", (data) => {
        console.log({ finish: data });
        setClientState(STATES.IDLE);
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
        <div>
          <VimClient
            socket={socket}
            isEditable={true}
            username={username}
          ></VimClient>
          <VimClient
            socket={socket}
            isEditable={false}
            username={opponentName}
          ></VimClient>
        </div>
      );
    default:
      return <div>{clientState}</div>;
  }
}