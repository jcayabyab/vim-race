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
    <RowWrapper>
      <RowGroupWrapper>{nameToDisplay}</RowGroupWrapper>
      <RowGroupWrapper>
        {isSent ? (
          <button onClick={handleCancel}>Cancel</button>
        ) : (
          <React.Fragment>
            <button onClick={handleAccept}>Accept</button>
            <button onClick={handleDecline}>Decline</button>
          </React.Fragment>
        )}
      </RowGroupWrapper>
    </RowWrapper>
  );
}
