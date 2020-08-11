import React, { useContext } from "react";
import VimButton from "../../utils/VimButton";
import styled from "styled-components";
import { ChallengesContext } from "./contexts/ChallengesContext";

const MenuButton = styled(VimButton)`
  font-size: 12pt;
  position: relative;
  padding: 5px;
  flex: 1;
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;

  ${({ active }) => !active && "background-color: #151515;"}

  :hover {
    text-decoration: none;
  }
`;

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  background-color: #212121;
  border: solid 1px black;
  border-top: none;
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
  width: 598px;
`;

const Badge = styled.span`
  color: white;
  font-weight: bold;
  background-color: rgb(215, 38, 56);
  padding: 3px 4px;
  margin: 0 10px;
  border-radius: 3px;

  :hover {
    text-decoration: none;
  }
`;

export default function MenuToggle({
  showChallenges,
  onChallengeClick,
  onGameStatusClick,
}) {
  const { receivedChallenges } = useContext(ChallengesContext);

  return (
    <Wrapper>
      <MenuButton active={showChallenges} onClick={onChallengeClick}>
        Challenges
        {!!receivedChallenges.length && (
          <Badge>{receivedChallenges.length}</Badge>
        )}
      </MenuButton>
      <MenuButton active={!showChallenges} onClick={onGameStatusClick}>
        Game status
      </MenuButton>
    </Wrapper>
  );
}
