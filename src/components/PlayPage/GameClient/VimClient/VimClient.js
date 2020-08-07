import React, { useEffect } from "react";
import useVimTextInjector from "./hooks/useVimTextInjector";
import useVimTextExtractor from "./hooks/useVimTextExtractor";
import useVimInit from "./hooks/useVimInit";
import useListenerHandler from "./hooks/useListenerHandler";
import useVimOptions from "./hooks/useVimOptions";
import { useVim, checkVimWasmIsAvailable } from "react-vim-wasm";
import { GAME_STATES } from "../states";
import opts from "./vimOptions";
const { canvasStyle, inputStyle } = opts;

function VimClient({
  user,
  isEditable,
  startText,
  handleClientInit,
  gameState,
  handleSubmission,
  handleKeystrokeReceived,
  handleVimKeydown,
  handleUnmount,
}) {
  const [vimOptions] = useVimOptions(user);
  const [validateSubmission] = useVimTextExtractor(
    isEditable,
    handleSubmission,
    user
  );

  const [canvasRef, inputRef, vim] = useVim({
    worker: process.env.PUBLIC_URL + "/vim-wasm/vim.js",
    ...vimOptions,
  });

  const [vimInitialized] = useVimInit(vim, handleClientInit);

  const { handleKeystrokeEvent } = useListenerHandler(
    vim,
    vimInitialized,
    user,
    gameState === GAME_STATES.PLAYING,
    isEditable,
    handleKeystrokeReceived,
    handleVimKeydown
  );
  useVimTextInjector(
    vim,
    startText,
    handleKeystrokeEvent,
    gameState
  );

  // focus on terminal upon game start
  useEffect(() => {
    if (isEditable && inputRef && gameState === GAME_STATES.PLAYING) {
      inputRef.current.focus();
    }
  }, [isEditable, inputRef, gameState]);

  // add init and file export callbacks
  useEffect(() => {
    if (vim) {
      vim.onFileExport = validateSubmission;
    }
  }, [vim, validateSubmission]);

  // do unmount logic on terminal unmount - typically
  // setting initialization flags
  useEffect(() => {
    if (handleUnmount) {
      return handleUnmount;
    }
  }, [handleUnmount]);

  return (
    <React.Fragment>
      <canvas style={canvasStyle} ref={canvasRef}></canvas>
      <input style={inputStyle} ref={inputRef} readOnly></input>
    </React.Fragment>
  );
}

// wrap for VimWasm compatilibility check
export default (props) => {
  return !checkVimWasmIsAvailable() ? (
    <VimClient {...props}></VimClient>
  ) : (
    <canvas style={canvasStyle}></canvas>
  );
};
