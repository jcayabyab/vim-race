import { useCallback, useEffect, useContext, useState } from "react";
import { ChallengesContext } from "../contexts/ChallengesContext";

const useChallengesSocketFunctions = (socket, user) => {
  const challengesState = useContext(ChallengesContext);
  const {
    addReceivedChallenge,
    addSentChallenge,
    removeReceivedChallenge,
    removeSentChallenge,
  } = challengesState;

  const handleRemoveChallenge = useCallback(() => {
    socket.on("remove challenge", (data) => {
      const { challenge } = data;
      if (user.id === challenge.senderId) {
        removeSentChallenge(challenge);
      } else {
        removeReceivedChallenge(challenge);
      }
    });
  }, [socket, user, removeSentChallenge, removeReceivedChallenge]);

  const handleChallengeSendSuccess = useCallback(() => {
    socket.on("sent challenge", (data) => {
      const { challenge } = data;

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
    (receiverId) => {
      socket.emit("sent challenge", { senderId: user.id, receiverId });
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

  const handleChallengeDecline = useCallback((challengeUuid) => {
    (challengeUuid) => {
      socket.emit("decline challenge", { id: user.id, challengeUuid });
    },
      [socket, user];
  });

  const [functionsInitialized, setFunctionsInitialized] = useState(false);

  // setup to listen for start and finish
  useEffect(() => {
    if (socket && !functionsInitialized && user) {
      handleRemoveChallenge();
      handleChallengeSendSuccess();
      handleNewChallenge();
      handleChallengeSendFail();
      setFunctionsInitialized(true);
    }
  }, [
    socket,
    functionsInitialized,
    setFunctionsInitialized,
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
