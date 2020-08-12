import { useState, useCallback, useEffect } from "react";
import setTimeoutPromise from "../../../../utils/setTimeoutPromise";
import { GAME_STATES } from "../../states";

/**
 * Handles text injection when game starts
 * @param {C} vim The vim terminal returned from useVim
 * @param {*} startText The starting text from the server - injected into client
 * @param {*} gameStarted true if game state === PLAYING
 * @param {*} handleKeystrokeEvent The event for handling keystrokes. Used to simulate an <Esc> press to reset cursor due to cursor bug
 */
const useVimTextInjector = (
  vim,
  startText,
  handleKeystrokeEvent,
  gameState
) => {
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

  const [gameNo, setGameNo] = useState(0);

  useEffect(() => {
    if (setGameNo) {
      if (gameState === GAME_STATES.LOADING) {
        setGameNo((prevNo) => prevNo + 1);
      }
    }
  }, [gameState, setGameNo]);

  useEffect(() => {
    const loadProblemOnStartup = async () => {
      if (gameState === GAME_STATES.PLAYING) {
        // load into vim client on startup
        // if game was already played this session, discard buffer
        // avoids multi-window bug
        if (gameNo > 1) {
          await setTimeoutPromise(100);
          // on reset, send discard buffer command
          vim.cmdline("e!");
        }
        // set timeout - screen needs to appear before writing to buffer
        await setTimeoutPromise(100);
        writeToTerminal(startText);
        // send Esc to the terminal to reset cursor
        const escEvent = {
          altKey: false,
          code: "Escape",
          ctrlKey: false,
          key: "Escape",
          keyCode: 27,
          metaKey: false,
          shiftKey: false,
        };
        // wait another 100 ms before resetting cursor
        await setTimeoutPromise(100);
        handleKeystrokeEvent(escEvent);
      }
    };

    loadProblemOnStartup();
  }, [
    vim,
    gameState,
    gameNo,
    startText,
    writeToTerminal,
    handleKeystrokeEvent,
  ]);
};

export default useVimTextInjector;
