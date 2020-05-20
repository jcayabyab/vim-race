export function handleKeyPress(worker, event) {
  // wrapper around notifyKeyEvent for sending and receiving events
  // based from onkeyDown function inside of vimwasm.ts
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
  if (key === "\u00A5" || (!shift && key === "|" && event.code === "IntlYen")) {
    key = "\\";
  }

  worker.notifyKeyEvent(key, event.keyCode, ctrl, shift, alt, meta);
}
