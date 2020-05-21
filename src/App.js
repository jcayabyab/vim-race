import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { useVim } from "react-vim-wasm";
import { handleKeyPress } from "./utils/client-scripts";
import NameInput from "./components/NameInput";

function App() {
  const [vimInitialized, setVimInitialized] = useState(false);
  const [msg, setMsg] = useState("Loading...");
  const [gameId, setGameId] = useState(null);
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState(null);

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
    socket.on("welcome", ({ msg }) => {
      setMsg(msg);
    });
  }, [socket]);

  useEffect(() => {
    if (vim1 && vim2 && username && gameId) {
      socket.on("keystroke", (data) => {
        console.log(data.username);
        if (data.username === username) {
          handleKeyPress(vim2.worker, data.event);
        } else {
          handleKeyPress(vim1.worker, data.event);
        }
      });
    }
    if (inputRef2.current && vim2 && username && gameId) {
      console.log(gameId);
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
          username,
          gameId,
        });
      });
    }
  }, [vim1, inputRef2, vim2, socket, username, gameId]);

  useEffect(() => {
    if (vimInitialized) {
      vim2.screen.input.elem.removeEventListener(
        "keydown",
        vim2.screen.input.onKeydown,
        { capture: true }
      );
    }
  }, [vim2, vimInitialized]);

  const onNameClick = (name) => {
    setUsername(name);
    socket.on("start", (data) => {
      console.log(data);
      setGameId(data.gameId);
    });
    socket.emit("request match", { username: name });
  };

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
      <NameInput onNameClick={onNameClick}></NameInput>
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
