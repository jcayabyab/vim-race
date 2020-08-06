import { useCallback, useEffect, useContext } from "react";
import { ChallengesContext } from "../contexts/ChallengesContext";

const useChallengesSocketFunctions = (socket, user) => {
  const challengesState = useContext(ChallengesContext);
  const {
    addReceivedChallenge,
    addSentChallenge,
    removeReceivedChallenge,
    removeSentChallenge,
    challengesSocketFunctionsInitialized,
    setChallengesSocketFunctionsInitialized,
  } = challengesState;

  const handleRemoveChallenge = useCallback(() => {
    socket.on("remove challenge", (data) => {
      const { challenge } = data;
      console.log(challenge)
      if (user.id === challenge.senderId) {
        removeSentChallenge(challenge);
      }
      if (user.id === challenge.receiverId) {
        removeReceivedChallenge(challenge);
      }
    });
  }, [socket, user, removeSentChallenge, removeReceivedChallenge]);

  const handleChallengeSendSuccess = useCallback(() => {
    socket.on("sent challenge", (data) => {
      const { challenge } = data;

      console.log("challenge successfully sent");

      addSentChallenge(challenge);
    });
  }, [socket, addSentChallenge]);

  const handleNewChallenge = useCallback(() => {
    socket.on("new challenge", (data) => {
      const { challenge } = data;

      addReceivedChallenge(challenge);
    });
  }, [socket, addReceivedChallenge]);

  const handleChallengeSendFail = useCallback(() => {
    socket.on("cannot send challenge", (data) => {
      alert("Cannot send challenge: " + data.error);
    });
  }, [socket]);

  const handleChallengeSend = useCallback(
    (receiverUsername) => {
      socket.emit("sent challenge", { sender: user, receiverUsername });
    },
    [socket, user]
  );

  const handleChallengeCancel = useCallback(
    (challengeUuid) => {
      socket.emit("cancel challenge", { id: user.id, challengeUuid });
    },
    [socket, user]
  );

  const handleChallengeAccept = useCallback(
    (challengeUuid) => {
      socket.emit("accept challenge", { id: user.id, challengeUuid });
    },
    [socket, user]
  );

  const handleChallengeDecline = useCallback(
    (challengeUuid) => {
      socket.emit("decline challenge", { id: user.id, challengeUuid });
    },
    [socket, user]
  );

  // setup to listen for start and finish
  useEffect(() => {
    if (socket && !challengesSocketFunctionsInitialized && user) {
      handleRemoveChallenge();
      handleChallengeSendSuccess();
      handleNewChallenge();
      handleChallengeSendFail();
      setChallengesSocketFunctionsInitialized(true);
    }
  }, [
    socket,
    challengesSocketFunctionsInitialized,
    setChallengesSocketFunctionsInitialized,
    user,
    handleRemoveChallenge,
    handleChallengeSendSuccess,
    handleNewChallenge,
    handleChallengeSendFail,
  ]);

  return {
    handleChallengeSend,
    handleChallengeAccept,
    handleChallengeDecline,
    handleChallengeCancel,
  };
};

export default useChallengesSocketFunctions;
