import React, { useState, createContext, useCallback } from "react";

export const ChallengesContext = createContext();

export const ChallengesProvider = (props) => {
  const [receivedChallenges, setReceivedChallenges] = useState([]);
  const [sentChallenges, setSentChallenges] = useState([]);

  const addReceivedChallenge = useCallback(
    (newChallenge) => {
      setReceivedChallenges((prevState) => [...prevState, newChallenge]);
    },
    [setReceivedChallenges]
  );

  const addSentChallenge = useCallback(
    (newChallenge) => {
      setSentChallenges((prevState) => [...prevState, newChallenge]);
    },
    [setSentChallenges]
  );

  const removeReceivedChallenge = useCallback(
    (challengeUuid) => {
      setReceivedChallenges((prevState) =>
        prevState.filter((challenge) => challenge.uuid !== challengeUuid)
      );
    },
    [setReceivedChallenges]
  );

  const removeSentChallenge = useCallback(
    (challengeUuid) => {
      setSentChallenges((prevState) =>
        prevState.filter((challenge) => challenge.uuid !== challengeUuid)
      );
    },
    [setSentChallenges]
  );

  // prettier-ignore
  const challengesObj = {
    receivedChallenges, sentChallenges,
    addReceivedChallenge, addSentChallenge,
    removeReceivedChallenge, removeSentChallenge,
  };

  return (
    <ChallengesContext.Provider value={challengesObj}>
      {props.children}
    </ChallengesContext.Provider>
  );
};
