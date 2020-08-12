import React, { useEffect } from "react";
import GameClient from "./GameClient/GameClient";
import styled from "styled-components";
import { GameClientStateProvider } from "./GameClient/contexts/GameClientContext";
import { SocketProvider } from "./GameClient/contexts/SocketContext";
import { GameClientSocketFunctionsProvider } from "./GameClient/contexts/GameClientSocketFunctionsContext";
import { ChallengesProvider } from "./GameClient/contexts/ChallengesContext";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { ChallengesSocketFunctionsProvider } from "./GameClient/contexts/ChallengesSocketFunctionsContext";

const ClientComponent = styled.div`
  max-width: 1400px;
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const useRedirectOnNoUsername = () => {
  const history = useHistory();
  const user = useSelector(({ user }) => user);
  useEffect(() => {
    if (user && !user.username) {
      history.push("/settings");
    }
  }, [user, history]);
};

export default function Play() {
  useRedirectOnNoUsername();

  return (
    <ClientComponent>
      <SocketProvider>
        <GameClientStateProvider>
          <ChallengesProvider>
            <GameClientSocketFunctionsProvider>
              <ChallengesSocketFunctionsProvider>
                <GameClient></GameClient>
              </ChallengesSocketFunctionsProvider>
            </GameClientSocketFunctionsProvider>
          </ChallengesProvider>
        </GameClientStateProvider>
      </SocketProvider>
    </ClientComponent>
  );
}
