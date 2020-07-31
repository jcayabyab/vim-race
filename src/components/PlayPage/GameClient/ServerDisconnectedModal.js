import React, { useContext, useEffect } from "react";
import Modal from "../../utils/Modal";
import SolidButton from "../../utils/SolidButton";
import styled from "styled-components";

const Message = styled.div`
  margin-bottom: 10px;
`;

export default function ServerDisconnectedModal({ isOpen }) {
  return (
    <Modal isOpen={isOpen}>
      <Message>You have disconnected from the server. Please refresh.</Message>
      <SolidButton onClick={() => window.location.reload()}>
        Refresh
      </SolidButton>
    </Modal>
  );
}
