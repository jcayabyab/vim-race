import React, { useState, useEffect } from "react";
import { GAME_STATES, PLAYER_STATES } from "../../PlayPage/GameClient/states";
import styled from "styled-components";
import SolidButton from "../../utils/SolidButton";
import useGameFunctions from "./hooks/useGameFunctions";
import { UserInfoHeader } from "../../PlayPage/GameClient/LeftClient";
import PlayerStateIcon from "../../PlayPage/GameClient/PlayerStateIcon";
import VimClient from "../../PlayPage/GameClient/VimClient/VimClient";
import GoalDisplay from "../../PlayPage/GameClient/GoalDisplay";

const Wrapper = styled.div`
  display: flex;
  width: 1200px;
  & > div {
    padding: 0px 10px;
  }
`;

const LeftSide = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const RightSide = styled.div`
  flex: 1;
`;

const Header = styled.h1`
  text-align: center;
`;

/**
 * Local single player version of GameClient.
 */
export default function DemoClient(props) {
  const [clientState, setClientState] = useState(GAME_STATES.IDLE);
  const [startText, setStartText] = useState("");
  const [goalText, setGoalText] = useState("");
  const [diff, setDiff] = useState([]);
  const [vimInitialized, setVimInitialized] = useState(false);

  const [playerState, setPlayerState] = useState(PLAYER_STATES.PLAYING);

  const {
    startGame,
    handleTerminalLoaded,
    handleVimKeydown,
    handleKeystrokeReceived,
    validateSubmission,
  } = useGameFunctions(
    setClientState,
    setStartText,
    setGoalText,
    goalText,
    setDiff,
    setPlayerState
  );

  useEffect(() => {
    if (vimInitialized && clientState === GAME_STATES.LOADING) {
      handleTerminalLoaded();
    }
  }, [vimInitialized, handleTerminalLoaded, clientState]);

  useEffect(() => {
    startGame();
  }, [startGame]);

  return (
    <Wrapper>
      <LeftSide>
        <UserInfoHeader>
          <div>Player</div>
          <PlayerStateIcon
            playerState={{ state: playerState }}
          ></PlayerStateIcon>
        </UserInfoHeader>
        <VimClient
          handleVimKeydown={handleVimKeydown}
          isEditable={playerState.state !== PLAYER_STATES.SUCCESS}
          startText={startText}
          handleClientInit={() => setVimInitialized(true)}
          gameState={clientState}
          handleSubmission={validateSubmission}
          handleKeystrokeReceived={handleKeystrokeReceived}
        ></VimClient>
        <GoalDisplay diff={diff} goalText={goalText}></GoalDisplay>
      </LeftSide>
      <RightSide>
        <Header>Test your Vim skills!</Header>
        <SolidButton onClick={startGame}>Try another problem</SolidButton>
        {props.children}
      </RightSide>
    </Wrapper>
  );
}
