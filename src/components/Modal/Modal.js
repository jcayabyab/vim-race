import React from "react";
import ReactModal from "react-modal";

const overlayStyles = {
  backgroundColor: "rgba(0, 0, 0, 0.4)",
  paddingTop: "30px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const contentStyles = {
  position: "static",
  backgroundColor: "#2d2d2d",
  border: "1px solid black",
  padding: "20px",
};

export default function Modal({ children, ...rest }) {
  return (
    <ReactModal
      {...rest}
      style={{
        overlay: overlayStyles,
        content: contentStyles,
      }}
    >
      {children}
    </ReactModal>
  );
}
