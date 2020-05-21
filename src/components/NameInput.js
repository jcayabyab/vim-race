import React, { useState } from "react";

export default function NameInput({ onNameClick }) {
  const [name, setName] = useState("");

  return (
    <div>
      <label>Username</label>
      <input value={name} onChange={(e) => setName(e.target.value)}></input>
      <button onClick={() => onNameClick(name)}>Start game</button>
    </div>
  );
}
