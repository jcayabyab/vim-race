import { useState, useEffect } from "react";
import io from "socket.io-client";

const useSocket = (endpoint) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!socket) {
      const newSocket = io(endpoint);
      setSocket(newSocket);
    }
    return () => {
      if (socket) socket.disconnect();
    };
  }, [socket, setSocket, endpoint]);

  return [socket];
};

export default useSocket;
