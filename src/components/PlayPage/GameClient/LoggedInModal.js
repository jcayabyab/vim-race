import React, { useContext, useEffect } from "react";
import Modal from "../../utils/Modal";
import { SolidLinkButton } from "../../utils/SolidButton";
import { GameClientContext } from "./contexts/GameClientContext";
import styled from "styled-components";

const Message = styled.div`
  margin-bottom: 10px;
`

export default function LoggedInModal({ isOpen }) {
  const { setLoginDetected } = useContext(GameClientContext);

  useEffect(() => {
    return () => {
      setLoginDetected(false);
    };
  }, [setLoginDetected]);

  return (
    <Modal isOpen={isOpen}>
      <Message>Another login has been detected.</Message>
      <SolidLinkButton to="/about">OK</SolidLinkButton>
    </Modal>
  );
}
