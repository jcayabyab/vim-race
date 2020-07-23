import styled from "styled-components";
import React from "react";

const InputStyled = styled.input`
  border: 1px solid black;
  border-radius: 2px;
  background-color: #151515;
  font-size: 18pt;
  padding: 7px;
  color: ${({ disabled }) => (disabled ? "gray" : "white")};
  font-family: "Share Tech Mono", source-code-pro, Menlo, Monaco, Consolas,
    "Courier New", monospace;
  width: 100%;
  box-sizing: border-box;

  &:focus {
    outline: none;
  }
`;

export default (props) => (
  <React.Fragment>
    <InputStyled {...props}></InputStyled>
  </React.Fragment>
);
