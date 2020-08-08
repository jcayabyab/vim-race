import React from "react";
import { Vim, checkVimWasmIsAvailable } from "react-vim-wasm";
import VimPlaceholder from "./VimPlaceholder";

// wrap for VimWasm compatilibility check
export default (props) => {
  return !checkVimWasmIsAvailable() ? (
    <Vim {...props}></Vim>
  ) : (
    <VimPlaceholder></VimPlaceholder>
  );
};
