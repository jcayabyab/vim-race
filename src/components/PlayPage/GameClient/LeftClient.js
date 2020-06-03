import React from "react";
import { useSelector } from "react-redux";
import STATES from "./states";
import VimClient from "./VimClient";
import styled from "styled-components";

const GoalBox = styled.div`
  background-color: #1f1f1f;
  border: 1px solid black;
  border-radius: 3px;
  font-family: "Lucida Console", "Consolas", monospace;
  white-space: pre-wrap;
  font-size: 11px;
  overflow: scroll;
  min-height: 300px;
`;

const GoalHeader = styled.div`
  color: white;
  font-family: "Share Tech Mono", "Consolas", monospace;
  font-size: 14px;
`;

// stores all functionality on left side -> user terminal, goal text
export default function LeftClient({
  socket,
  user,
  gameState,
  startText,
  goalText,
  handleClientInit,
}) {
  return (
    <div>
      <VimClient
        socket={socket}
        user={user}
        isEditable={gameState === STATES.PLAYING}
        startText={startText}
        handleClientInit={handleClientInit}
        userClient
      ></VimClient>
      <GoalHeader>Goal:</GoalHeader>
      <GoalBox>{goalText || ""}</GoalBox>
    </div>
  );
}
