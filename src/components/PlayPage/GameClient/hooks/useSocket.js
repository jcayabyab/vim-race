import { useState, useEffect } from "react";
import io from "socket.io-client";

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

export default useSocket;
