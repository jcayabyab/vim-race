import React, { useState, useEffect } from "react";
import "./App.css";
import io from "socket.io-client";
import { useVim } from "react-vim-wasm";
import { handleKeyPress } from "./utils/client-scripts";

function App() {
  const [vimInitialized, setVimInitialized] = useState(false);

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

  // only run at beginning to set socket
  useEffect(() => {
    const socket = io("http://localhost:4001");
    if (vim1) {
      socket.on("opponent_keystroke", (event) => {
        handleKeyPress(vim1.worker, event);
      });
    }
    if (vim2) {
      socket.on("my_keystroke", (event) => {
        handleKeyPress(vim2.worker, event);
      });
    }
    if (inputRef2.current && vim2) {
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
        socket.emit("my_keystroke", {
          key,
          keyCode,
          code,
          ctrlKey,
          shiftKey,
          altKey,
          metaKey,
        });
      });
    }
  }, [vim1, inputRef2, vim2]);

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
