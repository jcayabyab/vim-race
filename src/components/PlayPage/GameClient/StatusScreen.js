import React from "react";
import Timer from "../../utils/Timer";
import styled from "styled-components";
import { GAME_STATES } from "./states";
import PlayerStateIcon from "./PlayerStateIcon";

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

const RowWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const PlayerInfo = ({ username, playerState }) => {
  return (
    <RowWrapper>
      <div>{username}</div>
      <div>
        {!!playerState.completionTime && (
          <span style={{ marginRight: "5px" }}>{playerState.completionTime}</span>
        )}
        <PlayerStateIcon problemState={playerState}></PlayerStateIcon>
      </div>
    </RowWrapper>
  );
};
export default function StatusScreen({
  playerStates,
  gameState,
  user,
  opponent,
  prevGameFinished,
}) {
  const renderPlayerInfo = () => {
    // user first, then opponent
    const userState = playerStates[user.id];
    const opponentState = playerStates[opponent.id];
    return (
      <React.Fragment>
        <PlayerInfo
          username={user.username}
          playerState={userState}
        ></PlayerInfo>
        <PlayerInfo
          username={opponent.username}
          playerState={opponentState}
        ></PlayerInfo>
      </React.Fragment>
    );
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
      {Object.keys(playerStates).length && renderPlayerInfo()}
    </Wrapper>
  );
}
