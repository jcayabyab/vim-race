import React from "react";
import Timer from "../../utils/Timer";
import styled from "styled-components";
import { GAME_STATES, PLAYER_STATES } from "./states";
import PlayerStateIcon from "./PlayerStateIcon";
import SearchButton from "./SearchButton";

const Wrapper = styled.div`
  background-color: #212121;
  border: solid 1px black;
  border-radius: 3px;
  margin-top: 10px;
  min-height: 280px;
  width: 580px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 10px;
`;

const Title = styled.h2`
  margin: 0px;
`;

const RowWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  font-family: "Share Tech Mono", source-code-pro, Menlo, Monaco, Consolas,
    "Courier New", monospace;
  align-items: center;
  margin: 3px 0px;
`;

const CompletionTime = styled.span`
  margin-right: 5px;
`;

const PlayerInfo = ({ username, playerState }) => {
  return (
    <RowWrapper>
      <div>{username || "Unnamed user"}</div>
      <div style={{ display: "flex", alignItems: "center" }}>
        {!!playerState.completionTime && (
          <CompletionTime>{playerState.completionTime}</CompletionTime>
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
  handleSearch,
}) {
  const renderPlayerInfo = () => {
    // user first, then opponent
    const userState = playerStates[user.id] || { state: PLAYER_STATES.IDLE };
    const opponentState = playerStates[opponent.id] || {
      state: PLAYER_STATES.IDLE,
    };
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

  console.log(gameState);

  return (
    <Wrapper>
      <div>
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
      </div>
      {(gameState === GAME_STATES.IDLE ||
        gameState === GAME_STATES.SEARCHING) && (
        <SearchButton
          gameState={gameState}
          onClick={handleSearch}
        ></SearchButton>
      )}
    </Wrapper>
  );
}
