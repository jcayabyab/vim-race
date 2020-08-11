import { useState, useCallback, useEffect } from "react";

/**
 * Handles terminal initialization logic.
 * @param {*} handleClientInit The function to be called once the Vim terminal is initialized. Typically used
 * to signal the server that this player is ready to begin the game.
 */
const useVimInit = (vim, handleClientInit, removeKeyListener = true) => {
  const [vimInitialized, setVimInitialized] = useState(false);

  const onVimInit = useCallback(() => {
    if (removeKeyListener) {
      vim.screen.input.elem.removeEventListener(
        "keydown",
        vim.screen.input.onKeydown,
        { capture: true }
      );
    }
    // remove resize handler - currently broken
    window.removeEventListener("resize", vim.screen.resizer.onResize);
    handleClientInit();
    setVimInitialized(true);
  }, [vim, setVimInitialized, handleClientInit, removeKeyListener]);

  // add init and file export callbacks
  useEffect(() => {
    if (vim) {
      vim.onVimInit = onVimInit;
    }
  }, [vim, onVimInit]);

  return [vimInitialized];
};

export default useVimInit;
