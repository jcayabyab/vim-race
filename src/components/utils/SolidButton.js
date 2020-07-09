import styled from "styled-components";

// custom border
const SolidButton = styled.button`
  border: 1px solid black;
  border-radius: 3px;
  background-color: #d1d1d1;
  padding: 20px;
  font-size: 16pt;
  color: black;
  cursor: pointer;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
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
