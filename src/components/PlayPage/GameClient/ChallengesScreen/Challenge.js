import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faCheck, faBan } from "@fortawesome/free-solid-svg-icons";

const RowGroupWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 40px;
`;

const Wrapper = styled(RowGroupWrapper)`
  font-family: "Share Tech Mono", source-code-pro, Menlo, Monaco, Consolas,
    "Courier New", monospace;
  border-bottom: 1px solid #111111;

  padding: 3px 0px 3px 3px;

  :last-child {
    border-bottom: none;
  }
`;

const ChallengeButton = styled.button`
  padding: 7px 14px;
  background-color: rgb(${({ r, g, b }) => `${r}, ${g}, ${b}`});
  border: 0px;
  border-bottom: 0.2rem solid
    rgb(${({ r, g, b }) => `${r * 0.7}, ${g * 0.7}, ${b * 0.7}`});
  border-radius: 4px;
  margin: 3px 7px 5px;
  font-size: 14pt;
  color: white;
  cursor: pointer;

  :hover {
    background-color: rgb(
      ${({ r, g, b }) => `${r * 0.9}, ${g * 0.9}, ${b * 0.9}`}
    );
    border-bottom-color: rgb(
      ${({ r, g, b }) => `${r * 0.6}, ${g * 0.6}, ${b * 0.6}`}
    );
  }

  :active {
    background-color: rgb(
      ${({ r, g, b }) => `${r * 0.85}, ${g * 0.85}, ${b * 0.85}`}
    );
    border-bottom-color: rgb(
      ${({ r, g, b }) => `${r * 0.55}, ${g * 0.55}, ${b * 0.55}`}
    );
  }
`;

const ChallengeButtonIcon = styled(FontAwesomeIcon)`
  color: rgba(0, 0, 0, 0.4);
`;

export default function Challenge({
  challenge,
  isSent,
  handleAccept,
  handleDecline,
  handleCancel,
}) {
  const { senderUsername, receiverUsername } = challenge;
  const nameToDisplay = isSent ? receiverUsername : senderUsername;

  return (
    <Wrapper>
      <RowGroupWrapper>{nameToDisplay}</RowGroupWrapper>
      <RowGroupWrapper>
        {isSent ? (
          <ChallengeButton r={215} g={38} b={56} onClick={handleCancel}>
            <ChallengeButtonIcon icon={faBan}></ChallengeButtonIcon>
          </ChallengeButton>
        ) : (
          <React.Fragment>
            <ChallengeButton r={78} g={154} b={43} onClick={handleAccept}>
              <ChallengeButtonIcon icon={faCheck}></ChallengeButtonIcon>
            </ChallengeButton>
            <ChallengeButton r={215} g={38} b={56} onClick={handleDecline}>
              <ChallengeButtonIcon icon={faTimes}></ChallengeButtonIcon>
            </ChallengeButton>
          </React.Fragment>
        )}
      </RowGroupWrapper>
    </Wrapper>
  );
}
