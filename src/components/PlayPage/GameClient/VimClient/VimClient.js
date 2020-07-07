import React, { useEffect } from "react";
import useVimTextInjector from "./hooks/useVimTextInjector";
import useVimTextExtractor from "./hooks/useVimTextExtractor";
import useVimInit from "./hooks/useVimInit";
import useListenerHandler from "./hooks/useListenerHandler";
import useVimOptions from "./hooks/useVimOptions";
import { useVim } from "react-vim-wasm";
import { GAME_STATES } from "../states";
import opts from "./vimOptions";
const { canvasStyle, inputStyle } = opts;

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
  const [vimOptions] = useVimOptions(user);
  const [validateSubmission] = useVimTextExtractor(
    isEditable,
    sendSubmissionToSocket,
    user
  );

  const [canvasRef, inputRef, vim] = useVim({
    worker: process.env.PUBLIC_URL + "/vim-wasm/vim.js",
    ...vimOptions,
  });

  const [vimInitialized, onVimInit] = useVimInit(vim, handleClientInit);

  const { handleEvent } = useListenerHandler(
    vim,
    vimInitialized,
    user,
    socket,
    gameState === GAME_STATES.PLAYING,
    isEditable,
    handleKeystrokeReceived
  );
  useVimTextInjector(
    vim,
    startText,
    gameState === GAME_STATES.PLAYING,
    handleEvent
  );

  useEffect(() => {
    if (isEditable && inputRef && gameState === GAME_STATES.PLAYING) {
      inputRef.current.focus();
    }
  }, [isEditable, inputRef, gameState]);

  useEffect(() => {
    if (vim) {
      // remove initial onKeyDown event listener
      vim.onVimInit = onVimInit;
      vim.onFileExport = validateSubmission;
    }
  }, [vim, onVimInit, validateSubmission]);

  return (
    <React.Fragment>
      <canvas style={canvasStyle} ref={canvasRef}></canvas>
      <input style={inputStyle} ref={inputRef} readOnly></input>
    </React.Fragment>
  );
}
