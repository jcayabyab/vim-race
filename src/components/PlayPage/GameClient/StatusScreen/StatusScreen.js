import React, { useContext } from "react";
import Timer from "../../../utils/Timer";
import styled from "styled-components";
import { GAME_STATES, PLAYER_STATES } from "../states";
import SearchButton from "../SearchButton";
import SolidButton from "../../../utils/SolidButton";
import PlayerInfo from "./PlayerInfo";
import { useSelector } from "react-redux";
import { GameClientContext } from "../contexts/GameClientContext";
import { GameClientSocketFunctionsContext } from "../contexts/GameClientSocketFunctionsContext";
import Row from "../../../utils/Row";
import RematchButton from "./RematchButton";

const Wrapper = styled.div`
  background-color: #212121;
  border: solid 1px black;
  border-radius: 3px;
  ${({ gameState }) =>
    gameState === GAME_STATES.IDLE || gameState === GAME_STATES.SEARCHING
      ? `border-bottom: none;
     border-bottom-left-radius: 0px;
     border-bottom-right-radius: 0px;
    `
      : ""}
  height: 100%;
  width: 600px;
  padding: 10px;
  box-sizing: border-box;
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

export default function StatusScreen() {
  const user = useSelector((state) => state.user);

  const { gameState, opponent, playerStates, prevGameFinished } = useContext(
    GameClientContext
  );

  const { sendSearchReqToSocket, cancelMatchmaking, resignGame } = useContext(
    GameClientSocketFunctionsContext
  );

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
    <Wrapper gameState={gameState}>
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
        <Row>
          <RematchButton></RematchButton>
          <SearchButton
            style={{ marginLeft: "5px" }}
            onSearch={sendSearchReqToSocket}
            onCancel={cancelMatchmaking}
            gameState={gameState}
          ></SearchButton>
        </Row>
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
