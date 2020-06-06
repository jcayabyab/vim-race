import React from "react";
import STATES from "./states";
import VimClient from "./VimClient";
import styled from "styled-components";
import { Vim } from "react-vim-wasm";
import vimOptions from "./vimOptions";

const GoalBox = styled.code`
  background-color: #212121;
  border: 1px solid black;
  border-radius: 3px;
  font-family: "Lucida Console", "Consolas", monospace;
  white-space: pre-wrap;
  font-size: 9pt;
  min-height: 300px;
  width: 600px;
`;

const GoalHeader = styled.h3`
  color: white;
  font-family: "Share Tech Mono", "Consolas", monospace;
  margin: 0px 0px 10px;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0px 25px;
`;

// stores all functionality on left side -> user terminal, goal text
export default function LeftClient({
  socket,
  user,
  gameState,
  startText,
  goalText,
  handleClientInit,
  sendSubmissionToSocket,
  handleKeystrokeReceived,
  onVimTerminalInit,
  terminalLoaded,
}) {
  const vimProps = {
    worker: process.env.PUBLIC_URL + "/vim-wasm/vim.js",
    ...vimOptions,
    style: vimOptions.canvasStyle,
    onVimInit: () => {
      onVimTerminalInit();
    },
  };
  if (user.vimrcText) {
    vimProps.files["/home/web_user/.vim/vimrc"] = user.vimrcText;
  }
  return (
    <Wrapper>
      {gameState === STATES.SEARCHING || gameState === STATES.IDLE ? (
        <React.Fragment>
          <Vim {...vimProps}></Vim>
          {!terminalLoaded && <div>Loading Vim terminal...</div>}
        </React.Fragment>
      ) : (
        <VimClient
          socket={socket}
          user={user}
          isEditable={true}
          startText={startText}
          handleClientInit={handleClientInit}
          gameState={gameState}
          sendSubmissionToSocket={sendSubmissionToSocket}
          handleKeystrokeReceived={handleKeystrokeReceived}
        ></VimClient>
      )}
      <GoalHeader>Goal</GoalHeader>
      <GoalBox>{goalText || ""}</GoalBox>
    </Wrapper>
  );
}
