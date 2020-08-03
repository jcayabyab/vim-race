import styled from "styled-components";

export default styled.button`
  border: none;
  background-color: transparent;
  font-size: 20pt;
  padding: 15px;
  color: white;
  font-family: "Share Tech Mono", source-code-pro, Menlo, Monaco, Consolas,
    "Courier New", monospace;
  ${({ disabled }) =>
    !disabled
      ? `
  cursor: pointer;

  :hover {
    text-decoration: underline;
  }
  `
      : `
  color: gray;
  `}
`;

export const VimButtonWrapper = styled.div`
  font-family: "Share Tech Mono", Consolas, monospace;
  font-size: 20pt;

  & > * {
    padding: 15px;
    cursor: pointer;
    color: white;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
    display: block;
  }
`;
