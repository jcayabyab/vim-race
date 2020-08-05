import React, { useContext, useCallback } from "react";
import { PLAYER_STATES } from "./states";
import VimClient from "./VimClient/VimClient";
import GoalDisplay from "./GoalDisplay";
import styled from "styled-components";
import Vim from "../../utils/Vim";
import vimOptions from "./VimClient/vimOptions";
import PlayerStateIcon from "./PlayerStateIcon";
import { useSelector } from "react-redux";
import { GameClientSocketFunctionsContext } from "./contexts/GameClientSocketFunctionsContext";
import { GameClientContext } from "./contexts/GameClientContext";

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
export default function LeftClient() {
  const user = useSelector(({ user }) => user);

  const {
    gameState,
    startText,
    setUserInitialized,
    setLobbyTerminalLoaded,
    playerStates,
    diff,
    goalText,
  } = useContext(GameClientContext);
  const {
    handleVimKeydown,
    handleKeystrokeReceived,
    sendSubmissionToSocket,
  } = useContext(GameClientSocketFunctionsContext);

  // used to reset initialization variables when Vim component resets
  const handleUserUnmount = useCallback(() => setUserInitialized(false), [
    setUserInitialized,
  ]);

  // used for the sample lobby terminal
  const vimProps = {
    worker: process.env.PUBLIC_URL + "/vim-wasm/vim.js",
    ...vimOptions,
    style: vimOptions.canvasStyle,
    onVimInit: () => {
      setLobbyTerminalLoaded(true);
    },
  };
  if (user.vimrcText) {
    vimProps.files["/home/web_user/.vim/vimrc"] = user.vimrcText;
  }

  // The first game has started if startText is defined
  const gameStarted = !!startText;

  const playerState =
    playerStates && playerStates[user.id]
      ? playerStates[user.id]
      : { state: PLAYER_STATES.PLAYING };

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
            handleVimKeydown={handleVimKeydown}
            user={user}
            isEditable={playerState.state !== PLAYER_STATES.SUCCESS}
            startText={startText}
            handleClientInit={() => setUserInitialized(true)}
            gameState={gameState}
            handleSubmission={sendSubmissionToSocket}
            handleKeystrokeReceived={handleKeystrokeReceived}
            handleUnmount={handleUserUnmount}
          ></VimClient>
          <GoalDisplay diff={diff} goalText={goalText}></GoalDisplay>
        </React.Fragment>
      )}
    </Wrapper>
  );
}
