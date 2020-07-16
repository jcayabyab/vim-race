import React, { useState } from "react";
import Modal from "../../../utils/Modal";
import Input_ from "../../../utils/Input";
import VimButton from "../../../utils/VimButton";
import styled from "styled-components";

const Title = styled.h1`
  margin-top: 0px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
`;

const Input = styled(Input_)`
  margin-bottom: 0px;
`;

export default function ChallengeModal({
  isOpen,
  onRequestClose,
  handleChallengeSend,
}) {
  const [username, setUsername] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleChallengeSend(username);
    onRequestClose();
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <Title>Create a challenge</Title>
      <form onSubmit={handleSubmit}>
        <Row>
          <Input
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            placeholder={"user to challenge"}
          ></Input>
          <VimButton type="submit">:send</VimButton>
        </Row>
      </form>
    </Modal>
  );
}
