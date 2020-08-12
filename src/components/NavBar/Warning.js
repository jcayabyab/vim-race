import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const WarningWrapper = styled.div`
  display: flex;
  background-color: #c21a1a;
  padding: 5px 5px;
  align-items: center;
`;

const CloseWarningButton = styled.button`
  border: none;
  background-color: transparent;
  color: rgba(0, 0, 0, 0.5);
  cursor: pointer;
  font-size: 14pt;
`;

const WarningChild = styled.div`
  display: flex;
  justify-content: center;

  &:first-child {
    margin-right: auto;
    justify-content: flex-start;
  }

  &:last-child {
    margin-left: auto;
    justify-content: flex-end;
  }
`;

export default function Warning({ onCloseClick, children }) {
  return (
    <WarningWrapper>
      <WarningChild></WarningChild>
      <WarningChild>{children}</WarningChild>
      <WarningChild>
        <CloseWarningButton onClick={onCloseClick}>
          <FontAwesomeIcon icon={faTimes}></FontAwesomeIcon>
        </CloseWarningButton>
      </WarningChild>
    </WarningWrapper>
  );
}
