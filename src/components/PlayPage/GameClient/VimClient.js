import React, { useState, useEffect, useCallback } from "react";
import { useVim } from "react-vim-wasm";
import opts from "./vimOptions";
import STATES from "./states";

/**
 * Handles text injection when game starts
 * @param {C} vim The vim terminal returned from useVim
 * @param {*} startText The starting text from the server - injected into client
 * @param {*} gameStarted true if game state === PLAYING
 */
const useVimTextInjector = (vim, startText, gameStarted) => {
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
    if (gameStarted) {
      // load into vim client on startup
      // set timeout - screen needs to appear before writing to buffer
      // failsafe in case this function isn't passed down
      setTimeout(() => writeToTerminal(startText), 100);
    }
  }, [gameStarted, startText, writeToTerminal]);
};

/**
 * Handles text extraction from export callback in Vim
 * @param {*} socket The socket object initialized by GameClient - used for sending extracted text
 * @param {*} isUserClient True if this is the user client instead of the opponent's client. Used to prevent
 * @param {*} sendSubmissionToSocket Helper function to send submission text to client
 * a submission from the opponent client on your site
 */
const useVimTextExtractor = (isUserClient, sendSubmissionToSocket) => {
  const validateSubmission = useCallback(
    async (_, contents) => {
      // only send validate if your own client
      if (isUserClient) {
        // convert arraybuffer back into string
        const ab2str = (buf) => {
          return String.fromCharCode.apply(null, new Uint8Array(buf));
        };

        // trim to remove whitespace added at beginning or left at end
        const submissionText = ab2str(contents).trim();
        sendSubmissionToSocket(submissionText);
      }
    },
    [isUserClient, sendSubmissionToSocket]
  );

  return [validateSubmission];
};

/**
 * Handles terminal initialization logic.
 * @param {*} handleClientInit The function to be called once the Vim terminal is initialized. Typically used
 * to signal the server that this player is ready to begin the game.
 */
const useVimInit = (handleClientInit) => {
  const [vimInitialized, setVimInitialized] = useState(false);

  useEffect(() => {
    if (vimInitialized) {
      if (handleClientInit) {
        handleClientInit();
      }
    }
  }, [handleClientInit, vimInitialized]);

  return [vimInitialized, setVimInitialized];
};

/**
 * Handles all listener functions. In specific, removes initial event listener, adds keyDown event listener
 * for sending keystrokes to server, adds socket listener for getting keystrokes from server and sending
 * to client, and removes or adds this functionality when isEditable is toggled
 * @param {*} vim
 * @param {*} vimInitialized
 * @param {*} user
 * @param {*} socket
 * @param {*} gameStarted
 * @param {*} isEditable
 */
const useListenerHandler = (
  vim,
  vimInitialized,
  user,
  socket,
  gameStarted,
  isEditable,
  handleKeystrokeReceived
) => {
  // wrapper around notifyKeyEvent for sending and receiving events
  // based from onkeyDown function inside of vimwasm.ts, but adapted
  // to handle slimmed down event, i.e., removes preventDefault()
  // and stopPropagation()
  const handleEvent = useCallback(
    (event) => {
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
    },
    [vim]
  );

  // remove initial onKeyDown event listener
  useEffect(() => {
    // remove already existing event listener to
    // intercept key presses
    if (vimInitialized) {
      vim.screen.input.elem.removeEventListener(
        "keydown",
        vim.screen.input.onKeydown,
        { capture: true }
      );
    }
  }, [vimInitialized, vim]);

  // add socket listener for when server sends keystrokes
  useEffect(() => {
    if (gameStarted) {
      handleKeystrokeReceived(handleEvent, user);
    }
  }, [gameStarted, handleEvent, handleKeystrokeReceived, user]);

  // double check event listener along with isEditable
  const [listenerEnabled, setListenerEnabled] = useState(false);

  // logic for grabbing event info from event and passing to server
  const handleKeyDown = useCallback(
    (e) => {
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
    },
    [user, socket]
  );

  // handles isEditable logic - adds/removes event listener
  useEffect(() => {
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
    handleKeyDown,
  ]);
};

export default function VimClient({
  user,
  socket,
  isEditable,
  startText,
  handleClientInit,
  gameState,
  sendSubmissionToSocket,
  handleKeystrokeReceived,
}) {
  const { canvasStyle, inputStyle, ...vimOptions } = opts;
  if (user && user.vimrcText) {
    vimOptions.files["/home/web_user/.vim/vimrc"] = user.vimrcText;
  }
  const [vimInitialized, setVimInitialized] = useVimInit(handleClientInit);
  const [validateSubmission] = useVimTextExtractor(
    isEditable,
    sendSubmissionToSocket
  );
  const [canvasRef, inputRef, vim] = useVim({
    worker: process.env.PUBLIC_URL + "/vim-wasm/vim.js",
    onVimInit: () => {
      setVimInitialized(true);
    },
    onFileExport: validateSubmission,
    ...vimOptions,
  });
  useVimTextInjector(vim, startText, gameState === STATES.PLAYING);
  useListenerHandler(
    vim,
    vimInitialized,
    user,
    socket,
    gameState === STATES.PLAYING,
    isEditable,
    handleKeystrokeReceived
  );

  return (
    <React.Fragment>
      <canvas style={canvasStyle} ref={canvasRef}></canvas>
      <input style={inputStyle} value="" readOnly ref={inputRef}></input>
    </React.Fragment>
  );
}
