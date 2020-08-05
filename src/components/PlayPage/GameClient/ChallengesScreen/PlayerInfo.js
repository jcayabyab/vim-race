import React from "react";
import styled from "styled-components";
import PlayerStateIcon from "../PlayerStateIcon";
import Trophy1st from "../../../../assets/trophy-1st.png";
import Trophy2nd from "../../../../assets/trophy-2nd.png";

const CompletionTime = styled.span`
  margin-right: 5px;
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

const Trophy = styled.img`
  @supports (image-rendering: pixelated) {
    image-rendering: pixelated;
  }
  @supports not (image-rendering: pixelated) {
    image-rendering: crisp-edges;
  }
  width: ${17 * 2}px;
  height: ${20 * 2}px;
  margin-right: 7px;
`;

const PlayerInfo = ({ username, playerState }) => {
  const renderTrophy = () => {
    if (playerState.placement === 1) {
      return <Trophy src={Trophy1st}></Trophy>;
    } else if (playerState.placement === 2) {
      return <Trophy src={Trophy2nd}></Trophy>;
    } else {
    }
  };

  return (
    <UserRowWrapper>
      <RowWrapper>
        <div>{username || "Unnamed user"}</div>
      </RowWrapper>
      <RowWrapper>
        <div style={{ width: "41px" }}>{renderTrophy()}</div>
        {!!playerState.completionTime && (
          <CompletionTime>{playerState.completionTime}</CompletionTime>
        )}
        <PlayerStateIcon playerState={playerState}></PlayerStateIcon>
      </RowWrapper>
    </UserRowWrapper>
  );
};

export default PlayerInfo;