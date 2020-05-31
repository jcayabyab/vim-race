import React from "react";
import GameClient from "./GameClient/GameClient";
import NameInput from "../NameInput";

export default function Play() {
  return (
    <div>
      <NameInput onNameClick={(value) => setUsername(value)}></NameInput>
      <div>{username && "Current username: " + username}</div>
      <GameClient username={username}></GameClient>
    </div>
  );
}
