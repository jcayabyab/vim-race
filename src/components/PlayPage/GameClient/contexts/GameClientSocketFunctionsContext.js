import React, { createContext, useContext } from "react";
import { SocketContext } from "./SocketContext";
import { useSelector } from "react-redux";
import useGameClientSocketFunctions from "../hooks/useGameClientSocketFunctions";

export const GameClientSocketFunctionsContext = createContext();

// Requires SocketProvider as a parent
export const GameClientSocketFunctionsProvider = (props) => {
  const socket = useContext(SocketContext);
  const user = useSelector((state) => state.user);

  const socketFunctions = useGameClientSocketFunctions(socket, user);

  return (
    <GameClientSocketFunctionsContext.Provider value={socketFunctions}>
      {props.children}
    </GameClientSocketFunctionsContext.Provider>
  );
};
