import React from "react";
import { PLAYER_STATES } from "./states";
import styled from "styled-components";
import currentRect1 from "../../../assets/currentrect-1.png";
import loadingRect from "../../../assets/loadingrect.gif";
import correctRect from "../../../assets/correctrect.png";
import wrongRect from "../../../assets/wrongrect.png";

const LogoWrapper = styled.img`
  image-rendering: pixelated;
  height: ${31}px;
  width: ${31}px;
`;

export default function PlayerStateIcon({ problemState }) {
  switch (problemState) {
    case PLAYER_STATES.FAIL:
      return <LogoWrapper src={wrongRect}></LogoWrapper>;
    case PLAYER_STATES.PLAYING:
      return <LogoWrapper src={currentRect1}></LogoWrapper>;
    case PLAYER_STATES.VALIDATING:
      return <LogoWrapper src={loadingRect}></LogoWrapper>;
    case PLAYER_STATES.SUCCESS:
      return <LogoWrapper src={correctRect}></LogoWrapper>;
    default:
      console.log(problemState);
      return <div>invalid state</div>;
  }
}
