import { useCallback, useEffect, useState } from "react";

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
  gameStarted,
  isEditable,
  handleKeystrokeReceived,
  handleVimKeydown
) => {
  // wrapper around notifyKeyEvent for sending and receiving events
  // based from onkeyDown function inside of vimwasm.ts, but adapted
  // to handle slimmed down event, i.e., removes preventDefault()
  // and stopPropagation()
  const handleKeystrokeEvent = useCallback(
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

  // add socket listener for when server sends keystrokes
  useEffect(() => {
    if (gameStarted) {
      handleKeystrokeReceived(handleKeystrokeEvent, user);
    }
  }, [gameStarted, handleKeystrokeEvent, handleKeystrokeReceived, user]);

  // double check event listener along with isEditable
  const [listenerEnabled, setListenerEnabled] = useState(false);

  // handles isEditable logic - adds/removes event listener
  useEffect(() => {
    // in case editable logic needs to change in the future, e.g., on winner declaration
    if (vimInitialized) {
      if (isEditable && !listenerEnabled && handleVimKeydown) {
        vim.screen.input.elem.addEventListener("keydown", handleVimKeydown);
        setListenerEnabled(true);
      }
      if (!isEditable && listenerEnabled) {
        vim.screen.input.elem.removeEventListener("keydown", handleVimKeydown);
        setListenerEnabled(false);
      }
    }
  }, [
    isEditable,
    listenerEnabled,
    setListenerEnabled,
    vim,
    vimInitialized,
    handleVimKeydown,
  ]);

  return { handleKeystrokeEvent };
};

export default useListenerHandler;
