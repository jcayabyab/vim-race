import styled from "styled-components";

// custom border
const SolidButton = styled.button`
  border: 0px;
  border-bottom: 0.2rem solid #a1a1a1;
  border-radius: 3px;
  background-color: #d1d1d1;
  padding: 20px;
  font-size: 14pt;
  font-weight: 600;
  color: black;
  cursor: pointer;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 600px;

  :hover {
    background-color: #c1c1c1;
    border-bottom-color: #919191;
  }

  :active {
    background-color: #b1b1b1;
    border-bottom-color: #818181;
  }

  :focus {
    outline: none;
  }
`;

export const SolidAButton = styled.a`
  display: block;
  border: 1px solid black;
  border-radius: 3px;
  background-color: #d1d1d1;
  padding: 20px;
  font-size: 16pt;
  color: black;
  cursor: pointer;
  width: 100%;
  box-sizing: border-box;
  text-align: center;
  text-decoration: none;
`;

export default SolidButton;
