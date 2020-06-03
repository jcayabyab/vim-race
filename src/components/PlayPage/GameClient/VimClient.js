import React, { useState, useEffect, useCallback } from "react";
import { useVim } from "react-vim-wasm";
import styled from "styled-components";
import vimOptions from "./vimOptions";

const VimCanvas = styled.canvas`
  width: 600px;
  height: 400px;
`;

export default function VimClient({
  user,
  socket,
  isEditable,
  startText,
  handleClientInit,
  userClient
}) {
  // maybe move vim logic inside of here
  // we would need to initialize this when it's rendered,
  // then setup event listeners, then setup socket
  // would have to pass it event listener function only I think
  const [vimInitialized, setVimInitialized] = useState(false);
  // double check event listener along with isEditable
  const [listenerEnabled, setListenerEnabled] = useState(false);

  const validateSubmission = async (_, contents) => {
    // only send validate if your own client
    console.log(userClient);
    if (userClient) {
      // convert arraybuffer back into string
      const ab2str = (buf) => {
        return String.fromCharCode.apply(null, new Uint8Array(buf));
      };
      // trim to remove whitespace added at beginning
      socket.emit("validate", {
        id: user.id,
        submission: ab2str(contents).trim(),
      });
    }
  };

  const [canvasRef, inputRef, vim] = useVim({
    worker: process.env.PUBLIC_URL + "/vim-wasm/vim.js",
    onVimInit: () => {
      setVimInitialized(true);
    },
    onFileExport: validateSubmission,
    ...vimOptions,
  });

  const writeToTerminal = useCallback(
    async (str) => {
      const str2ab = (str) => {
        const buf = new ArrayBuffer(str.length + 1);
        const bufView = new Uint8Array(buf);
        let i;
        for (i = 0; i < str.length; i++) {
          bufView[i] = str.charCodeAt(i);
        }
        // add eol
        bufView[i] = "\n".charCodeAt(0);
        return buf;
      };

      // adds EOF
      const buf = str2ab(str);

      // Get shared buffer to write file contents from worker
      const [bufId, buffer] = await vim.worker.requestSharedBuffer(
        buf.byteLength
      );

      // write file contents
      new Uint8Array(buffer).set(new Uint8Array(buf));

      // notify worker to start processing the file contents
      vim.worker.notifyOpenFileBufComplete("start", bufId);
    },
    [vim]
  );

  useEffect(() => {
    if (vimInitialized && startText) {
      // load into vim client on startup
      // set timeout - screen needs to appear before writing to buffer
    // failsafe in case this function isn't passed down
    if (handleClientInit) {
      handleClientInit();
    }
      setTimeout(() => writeToTerminal(startText), 100);
      console.log("initialized");
    }
  }, [startText, vimInitialized, writeToTerminal]);

  // remove initial onKeyDown event listener
  useEffect(() => {
    // remove already existing event listener to
    // intercept key pressesk
    if (vimInitialized && socket && user) {
      vim.screen.input.elem.removeEventListener(
        "keydown",
        vim.screen.input.onKeydown,
        { capture: true }
      );
    }
  }, [vimInitialized, vim, socket, user]);

  // add socket logic
  useEffect(() => {
    // wrapper around notifyKeyEvent for sending and receiving events
    // based from onkeyDown function inside of vimwasm.ts, but adapted
    // to handle slimmed down event, i.e., removes preventDefault()
    // and stopPropagation()
    const handleEvent = (event) => {
      let key = event.key;
      const ctrl = event.ctrlKey;
      const shift = event.shiftKey;
      const alt = event.altKey;
      const meta = event.metaKey;

  if (key.length > 1) {
    if (
      key === "Unidentified" ||
      (ctrl && key === "Control") ||
      (shift && key === "Shift") ||
      (alt && key === "Alt") ||
      (meta && key === "Meta")
    ) {
      return;
    }
  }

  // Note: Yen needs to be fixed to backslash
  // Note: Also check event.code since Ctrl + yen is recognized as Ctrl + | due to Chrome bug.
  // https://bugs.chromium.org/p/chromium/issues/detail?id=871650
  if (
    key === "\u00A5" ||
    (!shift && key === "|" && event.code === "IntlYen")
  ) {
    key = "\\";
  }

    vim.worker.notifyKeyEvent(key, event.keyCode, ctrl, shift, alt, meta);
  };

    if (vimInitialized && user && socket)
      // add socket listener
      socket.on("keystroke", (data) => {
        if (data.id === user.id) {
          handleEvent(data.event);
        }
      });
  }, [vim, vimInitialized, socket, user]);

  // handles isEditable logic - adds/removes event listener
  useEffect(() => {
    const handleKeyDown = (e) => {
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
        id: user.id,
      });

    // client side validation
    // vim.cmdline("export submission");
  };

    // in case editable logic needs to change in the future, e.g., on winner declaration
    if (vimInitialized) {
      if (isEditable && !listenerEnabled) {
        vim.screen.input.elem.addEventListener("keydown", handleKeyDown);
        setListenerEnabled(true);
      }
      if (!isEditable && listenerEnabled) {
        vim.screen.input.elem.removeEventListener("keydown", handleKeyDown);
        setListenerEnabled(false);
      }
    }
  }, [
    isEditable,
    listenerEnabled,
    setListenerEnabled,
    vim,
    vimInitialized,
    socket,
    user,
  ]);

  const INPUT_STYLE = {
    width: "1px",
    color: "transparent",
    backgroundColor: "transparent",
    padding: "0px",
    border: "0px",
    outline: "none",
    position: "relative",
    top: "0px",
    left: "0px",
  };

  return (
    <div>
      <VimCanvas ref={canvasRef}></VimCanvas>
      <input style={INPUT_STYLE} value="" readOnly ref={inputRef}></input>
    </div>
  );
}
