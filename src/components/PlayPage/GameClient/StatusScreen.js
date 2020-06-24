import React from "react";
import Timer from "../../utils/Timer";
import styled from "styled-components";
import { GAME_STATES, PLAYER_STATES } from "./states";
import PlayerStateIcon from "./PlayerStateIcon";
import SearchButton from "./SearchButton";
import SolidButton from "../../utils/SolidButton";
import Trophy1st from "../../../assets/trophy-1st.png";
import Trophy2nd from "../../../assets/trophy-2nd.png";

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

const Trophy = styled.img`
  image-rendering: pixelated;
  width: ${17 * 2}px;
  height: ${20 * 2}px;
  margin-left: 5px;
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
  align-items: center;
  min-height: 40px;
`;

const UserRowWrapper = styled(RowWrapper)`
  font-family: "Share Tech Mono", source-code-pro, Menlo, Monaco, Consolas,
    "Courier New", monospace;
  margin: 3px 0px;
`;

const CompletionTime = styled.span`
  margin-right: 5px;
`;

const PlayerInfo = ({ username, playerState }) => {
  const renderTrophy = () => {
    if (playerState.placement === 1) {
      return <Trophy src={Trophy1st}></Trophy>;
    } else if (playerState.placement === 2) {
      return <Trophy src={Trophy2nd}></Trophy>;
    }
  };

  return (
    <UserRowWrapper>
      <RowWrapper>
        <div>{username || "Unnamed user"}</div>
        <div>{renderTrophy()}</div>
      </RowWrapper>
      <RowWrapper>
        {!!playerState.completionTime && (
          <CompletionTime>{playerState.completionTime}</CompletionTime>
        )}
        <PlayerStateIcon playerState={playerState}></PlayerStateIcon>
      </RowWrapper>
    </UserRowWrapper>
  );
};

export default function StatusScreen({
  playerStates,
  gameState,
  user,
  opponent,
  prevGameFinished,
  handleSearch,
  resignGame,
}) {
  const userState = playerStates[user.id] || { state: PLAYER_STATES.IDLE };
  const opponentState = playerStates[opponent.id] || {
    state: PLAYER_STATES.IDLE,
  };
  const renderPlayerInfo = () => {
    // user first, then opponent
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
      {gameState === GAME_STATES.PLAYING && (
        <SolidButton onClick={resignGame}>
          {opponentState.state === PLAYER_STATES.RESIGNED ||
          opponentState.state === PLAYER_STATES.DISCONNECTED
            ? "Accept win"
            : "Resign game"}
        </SolidButton>
      )}
    </Wrapper>
  );
}
