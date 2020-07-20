import React from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import Challenge from "./Challenge";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  flex: 1;
  margin: 0px 5px;
  height: 100%;
`;

// height manually calculated :(
const ListWrapper = styled.div`
  position: relative;
  flex: 1;
  max-height: 158px;
`;

const List = styled(PerfectScrollbar)`
  border: solid 1px black;
  border-radius: 3px;
`;

const Title = styled.h2`
  margin: 0 0 3px 6px;
  font-size: 14pt;
`;

export default function ChallengeList({
  challenges,
  title,
  isSentChallenges,
  handleChallengeAccept,
  handleChallengeDecline,
  handleChallengeCancel,
}) {
  const renderChallenges = () =>
    challenges.map((challenge) => (
      <Challenge
        key={challenge.uuid}
        challenge={challenge}
        isSent={isSentChallenges}
        handleAccept={() => handleChallengeAccept(challenge.uuid)}
        handleDecline={() => handleChallengeDecline(challenge.uuid)}
        handleCancel={() => handleChallengeCancel(challenge.uuid)}
      ></Challenge>
    ));

  return (
    <Wrapper>
      <Title>{title}</Title>
      <ListWrapper>
        <List>
          <div>{renderChallenges()}</div>
        </List>
      </ListWrapper>
    </Wrapper>
  );
}
