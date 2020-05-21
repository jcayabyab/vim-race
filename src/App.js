import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { useVim } from "react-vim-wasm";
import { handleKeyPress } from "./utils/client-scripts";

function App() {
  const [vimInitialized, setVimInitialized] = useState(false);
  const [msg, setMsg] = useState("Loading...");
  const [socket, setSocket] = useState(null);
  const [playerId, setPlayerId] = useState(null);

  const [canvasRef1, inputRef1, vim1] = useVim({
    worker: process.env.PUBLIC_URL + "/vim-wasm/vim.js",
  });

  const [canvasRef2, inputRef2, vim2] = useVim({
    worker: process.env.PUBLIC_URL + "/vim-wasm/vim.js",
    // used to remove original event listener
    onVimInit: () => {
      setVimInitialized(true);
    },
  });

  useEffect(() => {
    const socket = io("http://192.168.0.24:4001");
    setSocket(socket);
  }, [setSocket]);

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.on("welcome", ({ msg, playerId }) => {
      setMsg(msg);
      setPlayerId(playerId);
    });
  }, [socket]);

  // only run at beginning to set socket
  useEffect(() => {
    if (vim1 && vim2 && playerId) {
      socket.on("keystroke", (data) => {
        console.log(data.playerId);
        if (data.playerId === playerId) {
          handleKeyPress(vim2.worker, data.event);
        } else {
          handleKeyPress(vim1.worker, data.event);
        }
      });
    }
    if (inputRef2.current && vim2 && playerId) {
      console.log(vim2.screen.input.elem === inputRef2.current);
      console.log(vim2.screen.input.onKeydown);

      vim2.screen.input.elem.removeEventListener(
        "keydown",
        vim2.screen.input.onKeydown,
        { capture: true }
      );

      vim2.screen.input.elem.addEventListener("keydown", (e) => {
        e.preventDefault();

        const { key, keyCode, code, ctrlKey, shiftKey, altKey, metaKey } = e;
        socket.emit("keystroke", {
          event: {
            key,
            keyCode,
            code,
            ctrlKey,
            shiftKey,
            altKey,
            metaKey,
          },
          playerId,
        });
      });
    }
  }, [vim1, inputRef2, vim2, playerId, socket]);

  useEffect(() => {
    if (vimInitialized) {
      vim2.screen.input.elem.removeEventListener(
        "keydown",
        vim2.screen.input.onKeydown,
        { capture: true }
      );
    }
  }, [vim2, vimInitialized]);

  // old, sends by calling export and write
  const sendFile = async (fullpath, contents) => {
    console.log(contents);
    const [bufId, buffer] = await vim2.worker.requestSharedBuffer(
      contents.byteLength
    );

    new Uint8Array(buffer).set(new Uint8Array(contents));

    vim2.worker.notifyOpenFileBufComplete("a", bufId);
  };

  return (
    <div className="App">
      <div>{msg}</div>
      <header className="App-header">
        <div>
          <canvas
            ref={canvasRef1}
            onChange={(e) => console.log("hello")}
          ></canvas>
          <input ref={inputRef1}></input>
        </div>
        <button
          onClick={() => {
            console.log("help");
          }}
        >
          Export
        </button>
        <div>
          <canvas
            ref={canvasRef2}
            onChange={(e) => console.log("hello")}
          ></canvas>
          <input ref={inputRef2}></input>
        </div>
      </header>
    </div>
  );
}

export default App;
