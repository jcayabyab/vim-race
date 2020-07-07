import React, { useState } from "react";
import { PLAYER_STATES } from "./states";
import VimClient from "./VimClient/VimClient";
import GoalDisplay from "./GoalDisplay";
import styled from "styled-components";
import { Vim } from "react-vim-wasm";
import vimOptions from "./VimClient/vimOptions";
import PlayerStateIcon from "./PlayerStateIcon";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0px 25px;
`;

export const UserInfoHeader = styled.div`
  display: flex;
  font-family: "Share Tech Mono", source-code-pro, Menlo, Monaco, Consolas,
    "Courier New", monospace;
  justify-content: space-between;
  width: 600px;
  align-items: center;
  margin-bottom: 5px;

  & > * {
    font-family: "Share Tech Mono", source-code-pro, Menlo, Monaco, Consolas,
      "Courier New", monospace;
  }
`;

// stores all functionality on left side -> user terminal, goal text
export default function LeftClient({
  socket,
  user,
  gameState,
  startText,
  goalText,
  diff,
  handleClientInit,
  sendSubmissionToSocket,
  handleKeystrokeReceived,
  onVimTerminalInit,
  playerState,
  removeKeystrokeListeners,
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

  const gameStarted = !!startText;

  return (
    <Wrapper>
      {!gameStarted ? (
        <Vim {...vimProps}></Vim>
      ) : (
        <React.Fragment>
          <UserInfoHeader>
            <div>{user && user.username ? user.username : "Unnamed user"}</div>
            <PlayerStateIcon playerState={playerState}></PlayerStateIcon>
          </UserInfoHeader>
          <VimClient
            socket={socket}
            user={user}
            isEditable={playerState.state !== PLAYER_STATES.SUCCESS}
            startText={startText}
            handleClientInit={handleClientInit}
            gameState={gameState}
            sendSubmissionToSocket={sendSubmissionToSocket}
            handleKeystrokeReceived={handleKeystrokeReceived}
            removeKeystrokeListeners={removeKeystrokeListeners}
          ></VimClient>
          <GoalDisplay diff={diff} goalText={goalText}></GoalDisplay>
        </React.Fragment>
      )}
    </Wrapper>
  );
}
