import React, { useState } from "react";
import { PLAYER_STATES } from "./states";
import VimClient from "./VimClient";
import styled from "styled-components";
import { Vim } from "react-vim-wasm";
import vimOptions from "./vimOptions";
import PlayerStateIcon from "./PlayerStateIcon";

const GoalBox = styled.code`
  background-color: #212121;
  border: 1px solid black;
  border-radius: 3px;
  font-family: "Lucida Console", "Consolas", monospace;
  white-space: pre-wrap;
  font-size: 9pt;
  min-height: 300px;
  width: 600px;
  overflow: scroll;
`;

const GoalHeader = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
`;

const GoalHeaderChild = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  &:first-child {
    margin-right: auto;
    justify-content: flex-start;
  }

  &:last-child {
    margin-left: auto;
    justify-content: flex-end;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0px 25px;
`;

const ShowDiffButton = styled.button`
  border: 4px double white;
  background-color: transparent;
  font-family: "Share Tech Mono", source-code-pro, Menlo, Monaco, Consolas,
    "Courier New", monospace;
  color: white;
  cursor: pointer;
  padding: 5px;
  font-size: 12pt;
  border-radius: 3px;
`;

const RedText = styled.span`
  background-color: rgba(220, 50, 60, 0.6);
`;

const GreenText = styled.span`
  background-color: rgba(50, 205, 50, 0.6);
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

  const [showDiff, setShowDiff] = useState(false);

  const gameStarted = !!startText;

  const createDiffText = () => {
    return (
      <React.Fragment>
        {diff.map((token, index) => {
          if (token.removed) {
            return <RedText key={index}>{token.value}</RedText>;
          }
          if (token.added) {
            return <GreenText key={index}>{token.value}</GreenText>;
          }
          return <span>{token.value}</span>;
        })}
      </React.Fragment>
    );
  };

  return (
    <Wrapper>
      {!gameStarted ? (
        <Vim {...vimProps}></Vim>
      ) : (
        <React.Fragment>
          <UserInfoHeader>
            <div>{user && user.username ? user.username : "Unnamed user"}</div>
            <PlayerStateIcon problemState={playerState}></PlayerStateIcon>
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
        </React.Fragment>
      )}
      <GoalHeader>
        <GoalHeaderChild></GoalHeaderChild>
        <GoalHeaderChild>
          <h3>Goal</h3>
        </GoalHeaderChild>
        <GoalHeaderChild>
          {!!diff.length && (
            <ShowDiffButton onClick={() => setShowDiff(!showDiff)}>
              {showDiff ? "Hide" : "Show"} diff
            </ShowDiffButton>
          )}
        </GoalHeaderChild>
      </GoalHeader>
      <GoalBox>{showDiff && diff.length ? createDiffText() : goalText}</GoalBox>
    </Wrapper>
  );
}
