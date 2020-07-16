import React, { useState, useContext } from "react";
import styled from "styled-components";
import SolidButton from "../../../utils/SolidButton";
import { useSelector } from "react-redux";
import { ChallengesContext } from "../contexts/ChallengesContext";
import ChallengeModal from "./ChallengeModal";
import useChallengesSocketFunctions from "../hooks/useChallengesSocketFunctions";
import { SocketContext } from "../contexts/SocketContext";

const Wrapper = styled.div`
  background-color: #212121;
  border: solid 1px black;
  border-radius: 3px;
  margin-top: 10px;
  min-height: 280px;
  width: 580px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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

export default function ChallengesScreen() {
  const user = useSelector((state) => state.user);
  const socket = useContext(SocketContext);
  const [showModal, setShowModal] = useState(false);

  const {
    receivedChallenges,
    sentChallenges,
    addReceivedChallenge,
    addSentChallenge,
    removeReceivedChallenge,
    removeSentChallenge,
  } = useContext(ChallengesContext);

  const {
    handleChallengeAccept,
    handleChallengeSend,
    handleChallengeDecline,
    handleChallengeCancel,
  } = useChallengesSocketFunctions(socket, user);

  const openChallengesModal = () => setShowModal(true);
  const closeChallengesModal = () => setShowModal(false);

  return (
    <Wrapper>
      <div>
        <Header>
          <Title>Challenges</Title>
        </Header>
      </div>
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
