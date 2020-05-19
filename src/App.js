import React, { useState, useEffect } from "react";
import "./App.css";
import socketIOClient from "socket.io-client";
import { useVim, Vim } from "react-vim-wasm";
const ENDPOINT = "http://localhost:4001"

function App() {
  const [timeResponse, setTimeResponse] = useState("");

  // only run at beginning to set socket
  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    socket.on("FromAPI", data => {
      setTimeResponse(data);
    });
  }, [])

  const [canvasRef1, inputRef1, vim1] = useVim({
    worker: process.env.PUBLIC_URL + "/vim-wasm/vim.js",
  });

  const [canvasRef2, inputRef2, vim2] = useVim({
    worker: process.env.PUBLIC_URL + "/vim-wasm/vim.js",
  });

  if (inputRef2.current) {
    inputRef2.current.addEventListener("keydown", (e) => {
      // weird bug where event fires twice - set Handled 
      // variable to fix
      console.log(e.originalSource)
      if (!e.Handled) {
        console.log(e);
        const new_e = new e.constructor(e.type, e);
        inputRef1.current.dispatchEvent(new_e);
      }
      e.Handled = true;
    });
  }

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
      <p>
        It's <time dateTime={timeResponse}>{timeResponse}</time>
      </p>
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
            vim1.cmdline("export a");
          }}
        >
          Export
        </button>
        <div>
          <canvas
            ref={canvasRef2}
            onChange={(e) => console.log("hello")}
          ></canvas>
          <input ref={inputRef2} onKeyDown={(e) => console.log(e)}></input>
        </div>
      </header>
    </div>
  );
}

export default App;
