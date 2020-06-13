import React from "react";
import Timer from "../../utils/Timer";
import styled from "styled-components";
import { GAME_STATES } from "./states";

const Wrapper = styled.div`
  background-color: #212121;
  border: solid 1px black;
  border-radius: 3px;
  margin-top: 10px;
  min-height: 280px;
  width: 580px;
  padding: 10px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;

const Title = styled.h2`
  margin: 0px;
`;

export default function StatusScreen({
  playerState,
  gameState,
  user,
  opponent,
  prevGameFinished,
}) {
  const renderPlayerInfo = () => {
    // user first, then opponent
    const userState = playerState[user.id];
    const opponentState = playerState[opponent.id];
    return;
  };

  return (
    <Wrapper>
      <Header>
        <Title>Players</Title>
        <Timer
          style={{
            color: "white",
            fontFamily: "Share Tech Mono",
            fontSize: "16pt",
          }}
          shouldStop={prevGameFinished}
          shouldReset={gameState === GAME_STATES.PLAYING}
        ></Timer>
      </Header>
    </Wrapper>
  );
}
