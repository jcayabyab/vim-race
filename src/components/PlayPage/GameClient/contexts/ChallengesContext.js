import React, { useState, createContext, useCallback } from "react";

export const ChallengesContext = createContext();

export const ChallengesProvider = (props) => {
  const [receivedChallenges, setReceivedChallenges] = useState([]);
  const [sentChallenges, setSentChallenges] = useState([]);
  const [
    challengesSocketFunctionsInitialized,
    setChallengesSocketFunctionsInitialized,
  ] = useState(false);

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
    (challenge) => {
      setReceivedChallenges((prevState) =>
        prevState.filter((ch) => ch.uuid !== challenge.uuid)
      );
    },
    [setReceivedChallenges]
  );

  const removeSentChallenge = useCallback(
    (challenge) => {
      setSentChallenges((prevState) => {
        return prevState.filter((ch) => ch.uuid !== challenge.uuid);
      });
    },
    [setSentChallenges]
  );

  // prettier-ignore
  const challengesObj = {
    receivedChallenges, sentChallenges,
    addReceivedChallenge, addSentChallenge,
    removeReceivedChallenge, removeSentChallenge,
    challengesSocketFunctionsInitialized, setChallengesSocketFunctionsInitialized,
  };

  return (
    <ChallengesContext.Provider value={challengesObj}>
      {props.children}
    </ChallengesContext.Provider>
  );
};
