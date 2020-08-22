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
      <h2>August 22nd, 2020</h2>
      <ul>
        <li>Fixed a bug where pressing space scrolls the page down.</li>
      </ul>
      <h2>August 18th, 2020</h2>
      <ul>
        <li>Fixed a bug where a user's sent challenges weren't being cancelled when they enter a new match</li>
      </ul>
      <h2>August 17th, 2020 - Closer to a working version!</h2>
      <ul>
        <li>Added a "Users online" counter</li>
        <li>Fixed a bug in the problem generator with problems with CRLF line endings</li>
        <li>Added a warning when incompatible browsers try to log onto the website</li>
      </ul>
      <h2>August 5th, 2020 - First alpha release</h2>
      <ul>
        <li>Enjoy the game and please provide feedback!</li>
      </ul>
    </Wrapper>
  );
}
