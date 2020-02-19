import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Vim } from "react-vim-wasm";

function App() {
  const [vim1, setVim1] = useState(null);
  const [vim2, setVim2] = useState(null);

  const sendFile = async (fullpath, contents) => {
    console.log(contents);
    const [bufId, buffer] = await vim2.worker.requestSharedBuffer(contents.byteLength);

    new Uint8Array(buffer).set(new Uint8Array(contents));

    vim2.worker.notifyOpenFileBufComplete("a", bufId);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <Vim
          worker={process.env.PUBLIC_URL + "/vim-wasm/vim.js"}
          onFileExport={sendFile}
          onVimCreated={v => setVim1(v)}
          onKeyDown={() => vim1.cmdline("export")}
        ></Vim>
        <button
          onClick={() => {
            vim1.cmdline("export a");
          }}
        >
          Export
        </button>
        <Vim
          worker={process.env.PUBLIC_URL + "/vim-wasm/vim.js"}
          onFileExport={sendFile}
          onVimCreated={v => setVim2(v)}
        ></Vim>
      </header>
    </div>
  );
}

export default App;
