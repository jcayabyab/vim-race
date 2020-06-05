import React, { useCallback } from "react";
import { Vim } from "react-vim-wasm";
import vimOptions from "../PlayPage/GameClient/vimOptions";
import { useSelector, useDispatch } from "react-redux";
import { updateUserVimrc } from "../../actions/userActions";

/**
 * Handles text extraction from export callback in Vim
 * @param {*} socket The socket object initialized by GameClient - used for sending extracted text
 * @param {*} isUserClient True if this is the user client instead of the opponent's client. Used to prevent
 * @param {*} sendSubmissionToSocket Helper function to send submission text to client
 * a submission from the opponent client on your site
 */
const useVimTextExtractor = (onExtraction) => {
  const extractText = useCallback(
    async (_, contents) => {
      // only send validate if your own client
      // convert arraybuffer back into string
      const ab2str = (buf) => {
        return String.fromCharCode.apply(null, new Uint8Array(buf));
      };

      onExtraction(ab2str(contents));
    },
    [onExtraction]
  );

  return [extractText];
};

export default function VimrcPage() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [extractText] = useVimTextExtractor(async (vimrcText) => {
    dispatch(await updateUserVimrc(user, vimrcText));
  });

  const vimProps = {
    worker: process.env.PUBLIC_URL + "/vim-wasm/vim.js",
    ...vimOptions,
    onFileExport: extractText,
    style: vimOptions.canvasStyle,
    cmdArgs: ["~/vimrc-edit.vim"],
  };

  if (user.vimrcText) {
    vimProps.files["/home/web_user/.vim/vimrc"] = user.vimrcText;
    vimProps.files["~/vimrc-edit.vim"] = user.vimrcText;
  }

  return <div>{user && <Vim {...vimProps}></Vim>}</div>;
}
