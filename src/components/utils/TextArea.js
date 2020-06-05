import styled from "styled-components";

export default styled.textarea`
  border: 1px solid black;
  border-radius: 2px;
  background-color: #151515;
  font-size: 10pt;
  padding: 4px;
  color: white;
  font-family: "Lucida Console", source-code-pro, Menlo, Monaco, Consolas,
    "Courier New", monospace;
  &:focus {
    outline: none;
    display: block;
  }
`;
