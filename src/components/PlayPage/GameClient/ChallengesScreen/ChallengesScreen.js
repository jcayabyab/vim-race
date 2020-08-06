import React, { useState, useContext } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import useChallengesSocketFunctions from "../hooks/useChallengesSocketFunctions";
import { ChallengesContext } from "../contexts/ChallengesContext";
import { SocketContext } from "../contexts/SocketContext";
import SolidButton from "../../../utils/SolidButton";
import ChallengeModal from "./ChallengeModal";
import ChallengeList from "./ChallengeList";

const Wrapper = styled.div`
  background-color: #212121;
  border: solid 1px black;
  border-radius: 3px;
  width: 600px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  box-sizing: border-box;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 10px;
`;

const Title = styled.h2`
  margin: 0px;
`;

const Challenges = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  flex: 1;
  margin-bottom: 10px;
`;

export default function ChallengesScreen({ style }) {
  const user = useSelector((state) => state.user);
  const socket = useContext(SocketContext);
  const [showModal, setShowModal] = useState(false);

  const { receivedChallenges, sentChallenges } = useContext(ChallengesContext);

  console.log({ receivedChallenges, sentChallenges });

  const {
    handleChallengeAccept,
    handleChallengeSend,
    handleChallengeDecline,
    handleChallengeCancel,
  } = useChallengesSocketFunctions(socket, user);

  const openChallengesModal = () => setShowModal(true);
  const closeChallengesModal = () => setShowModal(false);

  return (
    <Wrapper style={style}>
      <Header>
        <Title>Challenges</Title>
      </Header>
      <Challenges>
        <ChallengeList
          title={"Sent"}
          challenges={sentChallenges}
          isSentChallenges={true}
          handleChallengeAccept={handleChallengeAccept}
          handleChallengeDecline={handleChallengeDecline}
          handleChallengeCancel={handleChallengeCancel}
        ></ChallengeList>
        <ChallengeList
          title={"Received"}
          challenges={receivedChallenges}
          isSentChallenges={false}
          handleChallengeAccept={handleChallengeAccept}
          handleChallengeDecline={handleChallengeDecline}
          handleChallengeCancel={handleChallengeCancel}
        ></ChallengeList>
      </Challenges>
      <SolidButton onClick={openChallengesModal}>
        Create a challenge
      </SolidButton>
      <ChallengeModal
        isOpen={showModal}
        onRequestClose={closeChallengesModal}
        handleChallengeSend={handleChallengeSend}
      ></ChallengeModal>
    </Wrapper>
  );
}
