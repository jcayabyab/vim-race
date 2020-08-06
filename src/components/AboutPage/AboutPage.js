import React from "react";
import { Link } from "react-router-dom";
import { VimButtonWrapper } from "../utils/VimButton";
import styled from "styled-components";
import Row from "../utils/Row";

const Wrapper = styled.div`
  max-width: 900px;
  width: 100%;
  padding: 25px;
  background-color: #212121;
  border-radius: 3px;
`;

export default function AboutPage() {
  // information about libraries, upcoming features, link to changelog
  // contact information
  return (
    <Wrapper>
      <Row>
        <VimButtonWrapper>
          <Link to="/vimtutor">:vimtutor</Link>
        </VimButtonWrapper>
        <VimButtonWrapper>
          <a
            href="https://github.com/JCayabyab/vim-race"
            target="_blank"
            rel="noopener noreferrer"
          >
            :github
          </a>
        </VimButtonWrapper>
        <VimButtonWrapper>
          <Link to="/about/changelog">:changelog</Link>
        </VimButtonWrapper>
      </Row>
      <h1>About VimRace</h1>
      <p>
        VimRace allows people to race each other by transforming snippets of
        text using Vim commands into a given goal text. The Vim terminal is
        integrated directly into the browser.
      </p>
      <p>
        To learn Vim, you may go to the vimtutor page to access the{" "}
        <code>vimtutor</code> text file. This ~1-hour long tutorial will give
        you all the basics you need for editing in Vim.
      </p>
      <p>
        For technical implementation details, as well as reporting bugs within
        the site/game client, you may visit the site's GitHub page.
      </p>
      <p>You can view new updates and planned features at our changelog.</p>
      <h2>About me</h2>
      <p>
        I built this site over the course of the COVID-19 pandemic! It borrows
        inspiration heavily from the{" "}
        <a
          href="https://www.typeracer.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          typeracer.com
        </a>{" "}
        website. I hope that this app will be a useful timesink for those of you
        still stuck at home.
      </p>
      <p>
        You can learn more about me at my website{" "}
        <a
          href="https://www.jcayabyab.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          here
        </a>
        .
      </p>
    </Wrapper>
  );
}
