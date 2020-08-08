import React from "react";
import opts from "../PlayPage/GameClient/VimClient/vimOptions";
const { canvasStyle } = opts;

export default function VimPlaceholder() {
  return (
    <div
      style={{
        ...canvasStyle,
        textAlign: "center",
        fontSize: "12pt",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        userSelect: "none",
      }}
    >
      <div>This terminal is not supported by your browser :(</div>
    </div>
  );
}
