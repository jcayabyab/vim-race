import React from "react";
import { GAME_STATES } from "./states";
import styled from "styled-components";
import Timer from "../../utils/Timer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import SolidButton from "../../utils/SolidButton";

const ButtonChild = styled.span`
  display: flex;
  justify-content: center;
  flex: 4;

  &:first-child {
    margin-right: auto;
    justify-content: flex-start;
    flex: 1;
  }

  &:last-child {
    margin-left: auto;
    justify-content: flex-end;
    flex: 1;
  }
`;

export default function SearchButton({ gameState, onClick }) {
  return (
    <SolidButton onClick={onClick}>
      <ButtonChild>
        {gameState === GAME_STATES.SEARCHING && (
          <FontAwesomeIcon
            style={{ color: "gray" }}
            icon={faTimes}
          ></FontAwesomeIcon>
        )}
      </ButtonChild>
      <ButtonChild>
        {gameState === GAME_STATES.IDLE
          ? "Search for game"
          : "Waiting for opponent..."}
      </ButtonChild>
      <ButtonChild>
        {gameState === GAME_STATES.SEARCHING && (
          <Timer style={{ color: "gray" }}></Timer>
        )}
      </ButtonChild>
    </SolidButton>
  );
}
