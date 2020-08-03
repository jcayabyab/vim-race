import React, { useCallback } from "react";
import opts from "../PlayPage/GameClient/VimClient/vimOptions";
import { useSelector } from "react-redux";
import useVimInit from "../PlayPage/GameClient/VimClient/hooks/useVimInit";
import useVimOptions from "../PlayPage/GameClient/VimClient/hooks/useVimOptions";
import { useVim } from "react-vim-wasm";
const { canvasStyle, inputStyle } = opts;

const useSendToTutor = (vim) => {
  const sendEsc = useCallback(() => {
    // input escape event to reset screen
    const escEvent = {
      altKey: false,
      code: "Escape",
      ctrlKey: false,
      key: "Escape",
      keyCode: 27,
      metaKey: false,
      shiftKey: false,
    };
    const {
      key,
      keyCode,
      ctrlKey: ctrl,
      shiftKey: shift,
      altKey: alt,
      metaKey: meta,
    } = escEvent;
    setTimeout(() => {
      vim.worker.notifyKeyEvent(key, keyCode, ctrl, shift, alt, meta);
    }, [100]);
  }, [vim]);

  const sendToTutor = useCallback(() => {
    setTimeout(() => vim.cmdline("e tutor"), 100);
    sendEsc();
  }, [vim, sendEsc]);

  return sendToTutor;
};

export default function TutorPage() {
  const user = useSelector(({ user }) => user);
  const [vimOptions] = useVimOptions(user);
  // used for the sample lobby terminal

  const [canvasRef, inputRef, vim] = useVim({
    worker: process.env.PUBLIC_URL + "/vim-wasm/vim.js",
    ...vimOptions,
  });

  const sendToTutor = useSendToTutor(vim);

  useVimInit(vim, sendToTutor, false);

  return (
    <div>
      <h1>VimTutor</h1>
      <canvas style={canvasStyle} ref={canvasRef}></canvas>
      <input style={inputStyle} ref={inputRef} readOnly></input>
    </div>
  );
}
