import React from "react";
import styled from "styled-components";

const RowGroupWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 40px;
`;

const RowWrapper = styled(RowGroupWrapper)`
  font-family: "Share Tech Mono", source-code-pro, Menlo, Monaco, Consolas,
    "Courier New", monospace;
  margin: 3px 0px;
`;

export default function Challenge({ challenge, isSent }) {
  const { senderUsername, receiverUsername } = challenge;
  const nameToDisplay = isSent ? receiverUsername : senderUsername;

  return (
    <RowWrapper>
      <RowGroupWrapper>{nameToDisplay}</RowGroupWrapper>
      <RowGroupWrapper>
        <button>Accept</button>
        <button>Decline</button>
      </RowGroupWrapper>
    </RowWrapper>
  );
}
