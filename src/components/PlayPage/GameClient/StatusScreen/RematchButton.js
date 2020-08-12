import React, { useContext } from "react";
import SolidButton from "../../../utils/SolidButton";
import { ChallengesSocketFunctionsContext } from "../contexts/ChallengesSocketFunctionsContext";
import { GameClientContext } from "../contexts/GameClientContext";
import { ChallengesContext } from "../contexts/ChallengesContext";

const RematchButton = () => {
  const {
    handleChallengeSend,
    handleChallengeAccept,
    handleChallengeCancel,
  } = useContext(ChallengesSocketFunctionsContext);
  const { sentChallenges, receivedChallenges } = useContext(ChallengesContext);

  const { opponent } = useContext(GameClientContext);

  const opponentRematchChallenge = receivedChallenges.find(
    (challenge) => challenge.senderUsername === opponent.username
  );
  const sentRematch = sentChallenges.find(
    (challenge) => challenge.receiverUsername === opponent.username
  );

  const handleClick = () => {
    if (opponentRematchChallenge) {
      handleChallengeAccept(opponentRematchChallenge.uuid);
    } else if (sentRematch) {
      handleChallengeCancel(sentRematch.uuid);
    } else {
      handleChallengeSend(opponent.username);
    }
  };

  const renderButtonText = () => {
    if (opponentRematchChallenge) {
      return "Accept rematch";
    } else if (sentRematch) {
      return "Cancel rematch";
    } else {
      return "Rematch";
    }
  };

  return (
    <SolidButton style={{ marginRight: "5px" }} onClick={handleClick}>
      {renderButtonText()}
    </SolidButton>
  );
};

export default RematchButton;
