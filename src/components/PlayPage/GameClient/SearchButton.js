import React from "react";
import { GAME_STATES } from "./states";
import styled from "styled-components";
import Timer from "react-compound-timer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

// custom border
const Button = styled.button`
  position: relative;
  border: 1px solid black;
  border-radius: 3px;
  background-color: #d1d1d1;
  padding: 20px;
  font-size: 16pt;
  color: black;
  cursor: pointer;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

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
    <Button onClick={onClick}>
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
          <Timer formatValue={(value) => `${value < 10 ? "0" : ""}${value}`}>
            <span style={{ color: "gray" }}>
              <Timer.Minutes></Timer.Minutes>:<Timer.Seconds></Timer.Seconds>
            </span>
          </Timer>
        )}
      </ButtonChild>
    </Button>
  );
}
