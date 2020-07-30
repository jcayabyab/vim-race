import React, { useEffect, useContext } from "react";
import LeftClient from "./LeftClient";
import RightClient from "./RightClient";
import { GAME_STATES } from "./states";
import styled from "styled-components";
import { GameClientContext } from "./contexts/GameClientContext";
import { GameClientSocketFunctionsContext } from "./contexts/GameClientSocketFunctionsContext";
import { Prompt } from "react-router-dom";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
`;

export default function GameClient() {
  const { gameState, userInitialized, opponentInitialized } = useContext(
    GameClientContext
  );

  const { handleTerminalsLoaded } = useContext(
    GameClientSocketFunctionsContext
  );

  useEffect(() => {
    if (
      userInitialized &&
      opponentInitialized &&
      gameState === GAME_STATES.LOADING
    ) {
      handleTerminalsLoaded();
    }
  }, [userInitialized, opponentInitialized, handleTerminalsLoaded, gameState]);

  useEffect(() => {
    const onBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "Leaving the game client will forfeit the game. Are you sure you want to leave?";
    };

    if (gameState !== GAME_STATES.IDLE) {
      window.onbeforeunload = onBeforeUnload;
    } else {
      window.onbeforeunload = null;
    }

    return () => (window.onbeforeunload = null);
  }, [gameState]);

  return (
    <Wrapper>
      <Prompt
        when={gameState !== GAME_STATES.IDLE}
        message={"Leaving the game client will forfeit the game. Are you sure you want to leave?"}
      ></Prompt>
      <LeftClient></LeftClient>
      <RightClient></RightClient>
    </Wrapper>
  );
}
