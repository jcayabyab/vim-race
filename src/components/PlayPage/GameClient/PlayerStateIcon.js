import React from "react";
import { PLAYER_STATES } from "./states";
import styled from "styled-components";
import currentRect1 from "../../../assets/currentrect-1.png";
import loadingRect from "../../../assets/loadingrect.gif";
import correctRect from "../../../assets/correctrect.png";
import disconnectRect from "../../../assets/disconnectrect.png";
import resignRect from "../../../assets/resignrect.png";
import acceptRect from "../../../assets/acceptrect.png";
import wrongRect from "../../../assets/wrongrect.png";

const LogoWrapper = styled.img`
  image-rendering: pixelated;
  height: ${31}px;
  width: ${31}px;
`;

export default function PlayerStateIcon({ playerState }) {
  switch (playerState.state) {
    case PLAYER_STATES.FAIL:
      return <LogoWrapper src={wrongRect}></LogoWrapper>;
    case PLAYER_STATES.PLAYING:
      return <LogoWrapper src={currentRect1}></LogoWrapper>;
    case PLAYER_STATES.VALIDATING:
      return <LogoWrapper src={loadingRect}></LogoWrapper>;
    case PLAYER_STATES.SUCCESS:
      return <LogoWrapper src={correctRect}></LogoWrapper>;
    case PLAYER_STATES.DISCONNECTED:
      return <LogoWrapper src={disconnectRect}></LogoWrapper>;
    case PLAYER_STATES.RESIGNED:
      return (
        <LogoWrapper
          src={playerState.placement ? acceptRect : resignRect}
        ></LogoWrapper>
      );
    default:
      console.log(playerState);
      return <div>invalid state</div>;
  }
}
