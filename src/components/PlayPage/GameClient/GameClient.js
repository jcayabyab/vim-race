import React, { useEffect, useContext } from "react";
import LeftClient from "./LeftClient";
import RightClient from "./RightClient";
import { GAME_STATES } from "./states";
import styled from "styled-components";
import { GameClientContext } from "./contexts/GameClientContext";
import { Prompt } from "react-router-dom";
import LoggedInModal from "./LoggedInModal";
import ServerDisconnectedModal from "./ServerDisconnectedModal";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
`;

export default function GameClient() {
  const { gameState, loginDetected, serverDisconnected } = useContext(
    GameClientContext
  );

  useEffect(() => {
    const onBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue =
        "Leaving the game client will forfeit the game. Are you sure you want to leave?";
    };

    if (gameState !== GAME_STATES.IDLE && !loginDetected) {
      window.onbeforeunload = onBeforeUnload;
    } else {
      window.onbeforeunload = null;
    }

    return () => (window.onbeforeunload = null);
  }, [gameState, loginDetected]);

  return (
    <Wrapper>
      <Prompt
        when={gameState !== GAME_STATES.IDLE && !loginDetected}
        message={
          "Leaving the game client will forfeit the game. Are you sure you want to leave?"
        }
      ></Prompt>
      <LeftClient></LeftClient>
      <RightClient></RightClient>
      <LoggedInModal isOpen={loginDetected}></LoggedInModal>
      <ServerDisconnectedModal
        isOpen={serverDisconnected}
      ></ServerDisconnectedModal>
    </Wrapper>
  );
}
