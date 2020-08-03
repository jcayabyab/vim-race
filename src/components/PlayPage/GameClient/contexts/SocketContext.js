import React, { createContext } from "react";
import useSocket from "../hooks/useSocket";
import { socketIoEndpoint } from "../../../../config/keys";

export const SocketContext = createContext();

export const SocketProvider = (props) => {
  const [socket] = useSocket(socketIoEndpoint);

  return (
    <SocketContext.Provider value={socket}>
      {props.children}
    </SocketContext.Provider>
  );
};
