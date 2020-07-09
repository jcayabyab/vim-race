import React, { createContext } from "react";
import useSocket from "../hooks/useSocket";

export const SocketContext = createContext();

export const SocketProvider = (props) => {
  const [socket] = useSocket(
    process.env.NODE_ENV === "production"
      ? "https://vimrace.herokuapp.com"
      : "http://192.168.0.24:4001"
  );

  return (
    <SocketContext.Provider value={socket}>
      {props.children}
    </SocketContext.Provider>
  );
};
