import React, { useCallback, useState, useEffect } from "react";
import { Vim } from "react-vim-wasm";
import vimOptions from "../PlayPage/GameClient/VimClient/vimOptions";
import { useSelector, useDispatch } from "react-redux";
import { updateUserVimrc } from "../../actions/userActions";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Wrapper = styled.div`
  max-width: 700px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #212121;
  padding: 25px;
`;

const ButtonWrapper = styled.div`
  font-family: "Share Tech Mono", Consolas, monospace;
  font-size: 18pt;

  & > * {
    padding: 20px;
    cursor: pointer;
    color: white;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
    display: block;
  }
`;
/**
 * Handles text extraction from export callback in Vim
 * @param {*} onExtraction callback that runs when the extraction completes
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
  const [vimrc, setVimrc] = useState("");
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
    cmdArgs: ["/home/web_user/.vim/vimrc"],
    clipboard: true,
    readClipboard: () =>
      navigator.clipboard ? navigator.clipboard.readText() : null,
    onWriteClipboard: (text) =>
      navigator.clipboard ? navigator.clipboard.writeText(text) : null,
  };

  // if user has vimrc, replace default with their .vimrc
  useEffect(() => {
    if (user && user.vimrcText) {
      setVimrc(user.vimrcText);
    }
  }, [user]);

  if (vimrc) {
    vimProps.files["/home/web_user/.vim/vimrc"] = vimrc;
  }

  return (
    <Wrapper>
      <h1>Edit .vimrc</h1>
      <p>
        You can edit your .vimrc settings here. Note that plugins are currently
        not officially supported. Using plugin managers like VimPlug or Vundle
        may have unintended effects.
      </p>
      {user && <Vim {...vimProps}></Vim>}
      <p>
        Upload your settings using <code>:w</code> then <code>:export</code>.
        You may also drag your currrent <code>.vimrc</code> directly into the
        terminal for uploading.
      </p>
      <ButtonWrapper>
        <Link to="/settings">Back to main settings</Link>
      </ButtonWrapper>
      <h2>Tips</h2>
      <ul>
        <li>
          All problems have tabs converted to 4 spaces. The following line is
          recommended to be in your <code>.vimrc</code>:{" "}
          <pre>
            <code>
              set expandtab tabstop=4 shiftwidth=4 softtabstop=4 smarttab
            </code>
          </pre>
        </li>
        <li>
          Currently, the <code>:w</code> and <code>:export</code> commands are
          used to send a submission to the backend. This can be binded to a
          simple keybind using a mapping such as:{" "}
          <pre>
            <code>
              nnoremap {"<Leader>"}e :w{"<CR>"}:export{"<CR>"}
            </code>
          </pre>
        </li>
      </ul>
    </Wrapper>
  );
}
