import { useState, useCallback } from "react";

/**
 * Handles terminal initialization logic.
 * @param {*} handleClientInit The function to be called once the Vim terminal is initialized. Typically used
 * to signal the server that this player is ready to begin the game.
 */
const useVimInit = (vim, handleClientInit) => {
  const [vimInitialized, setVimInitialized] = useState(false);

  const onVimInit = useCallback(() => {
    vim.screen.input.elem.removeEventListener(
      "keydown",
      vim.screen.input.onKeydown,
      { capture: true }
    );
    // remove resize handler - currently broken
    window.removeEventListener("resize", vim.screen.resizer.onResize);
    handleClientInit();
    setVimInitialized(true);
  }, [vim, setVimInitialized, handleClientInit]);

  return [vimInitialized, onVimInit];
};

export default useVimInit;
