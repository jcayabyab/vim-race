import React, { createContext, useContext } from "react";
import { SocketContext } from "./SocketContext";
import { useSelector } from "react-redux";
import useChallengesSocketFunctions from "../hooks/useChallengesSocketFunctions";

export const ChallengesSocketFunctionsContext = createContext();

// Requires SocketProvider as a parent
export const ChallengesSocketFunctionsProvider = (props) => {
  const socket = useContext(SocketContext);
  const user = useSelector((state) => state.user);

  const socketFunctions = useChallengesSocketFunctions(socket, user);

  return (
    <ChallengesSocketFunctionsContext.Provider value={socketFunctions}>
      {props.children}
    </ChallengesSocketFunctionsContext.Provider>
  );
};
