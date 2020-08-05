import React from "react";
import { Vim, checkVimWasmIsAvailable } from "react-vim-wasm";
import opts from "../PlayPage/GameClient/VimClient/vimOptions";
const { canvasStyle } = opts;

// wrap for VimWasm compatilibility check
export default (props) => {
  return !checkVimWasmIsAvailable() ? (
    <Vim {...props}></Vim>
  ) : (
    <canvas style={canvasStyle}></canvas>
  );
};
