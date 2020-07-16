import React from "react";
import GameClient from "./GameClient/GameClient";
import styled from "styled-components";
import { GameClientStateProvider } from "./GameClient/contexts/GameClientContext";
import { SocketProvider } from "./GameClient/contexts/SocketContext";
import { GameClientSocketFunctionsProvider } from "./GameClient/contexts/GameClientSocketFunctionsContext";
import { ChallengesProvider } from "./GameClient/contexts/ChallengesContext";

const ClientComponent = styled.div`
  max-width: 1400px;
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

export default function Play() {
  return (
    <ClientComponent>
      <SocketProvider>
        <GameClientStateProvider>
          <ChallengesProvider>
            <GameClientSocketFunctionsProvider>
              <GameClient></GameClient>
            </GameClientSocketFunctionsProvider>
          </ChallengesProvider>
        </GameClientStateProvider>
      </SocketProvider>
    </ClientComponent>
  );
}
