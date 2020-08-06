import React, { useState, useEffect } from "react";
import Modal from "../utils/Modal";
import { checkVimWasmIsAvailable } from "react-vim-wasm";
import Row from "../utils/Row";
import browserIncompatibleImg from "../../assets/browser-incompatible.png";
import styled from "styled-components";
import SolidButton from "../utils/SolidButton";

const BrowserIncompatibleImg = styled.img`
  @supports (image-rendering: pixelated) {
    image-rendering: pixelated;
  }
  @supports not (image-rendering: pixelated) {
    image-rendering: crisp-edges;
  }
  height: ${48 * 4}px;
  width: ${47 * 4}px;
  margin-right: 20px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const useBrowserCheck = () => {
  const [browserCompatible, setBrowserCompatible] = useState(true);

  useEffect(() => {
    if (!checkVimWasmIsAvailable()) {
      setBrowserCompatible(true);
    } else {
      setBrowserCompatible(false);
    }
  }, []);

  return browserCompatible;
};

export default function BrowserIncompatibleModal() {
  const browserCompatible = useBrowserCheck();
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setModalOpen(!browserCompatible);
  }, [browserCompatible, setModalOpen]);

  return (
    <Modal isOpen={modalOpen}>
      <Row>
        <BrowserIncompatibleImg
          src={browserIncompatibleImg}
        ></BrowserIncompatibleImg>
        <div style={{ flex: 1 }}>
          <h1>Whoops!</h1>
          <p>
            We're sorry! Your browser does not support the features needed to
            run the Vim terminal.
          </p>
          <p>
            Please switch to a browser that supports the{" "}
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer#Browser_compatibility"
              target="_blank"
              rel="noopener noreferrer"
            >
              SharedArrayBuffer
            </a>{" "}
            and{" "}
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Atomics#Browser_compatibility"
              target="_blank"
              rel="noopener noreferrer"
            >
              Atomics
            </a>{" "}
            classes.
          </p>
          <ButtonWrapper>
            <SolidButton onClick={() => setModalOpen(false)}>
              I understand, let me in anyways
            </SolidButton>
          </ButtonWrapper>
        </div>
      </Row>
    </Modal>
  );
}
