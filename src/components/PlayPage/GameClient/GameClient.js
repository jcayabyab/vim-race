import React, { useEffect, useContext } from "react";
import LeftClient from "./LeftClient";
import RightClient from "./RightClient";
import { GAME_STATES } from "./states";
import styled from "styled-components";
import { GameClientContext } from "./contexts/GameClientContext";
import { GameClientSocketFunctionsContext } from "./contexts/GameClientSocketFunctionsContext";

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

  return (
    <Wrapper>
      <LeftClient></LeftClient>
      <RightClient></RightClient>
    </Wrapper>
  );
}
