import React from "react";
import GameClient from "./GameClient/GameClient";
import styled from "styled-components";

const ClientComponent = styled.div`
  max-width: 1400px;
  width: 100%;
  display: flex;
  justify-content: space-between;
`

export default function Play() {
  return (
    <ClientComponent>
      <GameClient></GameClient>
    </ClientComponent>
  );
}
