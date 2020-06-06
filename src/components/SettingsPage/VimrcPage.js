import React, { useCallback } from "react";
import { Vim } from "react-vim-wasm";
import vimOptions from "../PlayPage/GameClient/vimOptions";
import { useSelector, useDispatch } from "react-redux";
import { updateUserVimrc } from "../../actions/userActions";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Wrapper = styled.div`
  max-width: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  };

  if (user.vimrcText) {
    vimProps.files["/home/web_user/.vim/vimrc"] = user.vimrcText;
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
      </p>
      <ButtonWrapper>
        <Link to="/settings">Back to main settings</Link>
      </ButtonWrapper>
    </Wrapper>
  );
}
