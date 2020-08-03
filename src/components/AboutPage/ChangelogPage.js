import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  max-width: 900px;
  width: 100%;
  padding: 25px;
  background-color: #212121;
  border-radius: 3px;
`;

export default function ChangelogPage() {
  return (
    <Wrapper>
      <h1>Planned features</h1>
      <ul>
        <li>
          Custom plugin support (use your original <code>.vimrc</code> to the
          fullest!)
        </li>
        <li>Procedurally generated VimRace problems</li>
        <li>Rating system</li>
      </ul>
      <h1>Changelog</h1>
      <h2>August 5th, 2020 - Initial release</h2>
      <ul>
        <li>Enjoy the game and please provide feedback!</li>
      </ul>
    </Wrapper>
  );
}
