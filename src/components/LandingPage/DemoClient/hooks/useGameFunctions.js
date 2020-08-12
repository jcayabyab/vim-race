import { useCallback, useState } from "react";
import {
  GAME_STATES,
  PLAYER_STATES,
} from "../../../PlayPage/GameClient/states";
import axios from "axios";
import { diffChars } from "diff";

const useGameFunctions = (
  setClientState,
  setStartText,
  setGoalText,
  goalText,
  setDiff,
  setPlayerState
) => {
  const startGame = useCallback(async () => {
    setClientState(GAME_STATES.LOADING);
    const res = await axios.get("/api/demo/problem");
    const { startText, goalText, diff } = res.data;
    setPlayerState(PLAYER_STATES.PLAYING);
    setStartText(startText);
    setGoalText(goalText);
    setDiff(diff);
  }, [setClientState, setPlayerState, setStartText, setGoalText, setDiff]);

  const handleTerminalLoaded = useCallback(() => {
    setClientState(GAME_STATES.PLAYING);
  }, [setClientState]);

  // this pattern is used to conform to VimClient and matches the socket
  // version of the functions
  const [handleTerminalKeyDown, setHandleTerminalKeyDown] = useState(null);

  // set null so that listener only added when handleTerminalKeyDown
  // is initialized
  const handleVimKeydown = useCallback(
    handleTerminalKeyDown
      ? (e) => {
          if (handleTerminalKeyDown) {
            handleTerminalKeyDown(e);
          }
        }
      : null,
    [handleTerminalKeyDown]
  );

  const handleKeystrokeReceived = useCallback(
    (handleKeystrokeEvent) => {
      const callback = (e) => {
        handleKeystrokeEvent(e);
      };
      setHandleTerminalKeyDown(() => callback);
    },
    [setHandleTerminalKeyDown]
  );

  const validateSubmission = useCallback(
    (_, submissionText) => {
      if (submissionText.trim() === goalText.trim()) {
        setPlayerState(PLAYER_STATES.SUCCESS);
        setClientState(GAME_STATES.IDLE);
      } else {
        setDiff(diffChars(submissionText.trim(), goalText.trim()));
        setPlayerState(PLAYER_STATES.FAIL);
      }
    },
    [setClientState, setPlayerState, setDiff, goalText]
  );

  const resignGame = useCallback(() => {
    setPlayerState(PLAYER_STATES.RESIGNED);
    setClientState(GAME_STATES.IDLE);
  }, [setPlayerState, setClientState]);

  return {
    startGame,
    handleTerminalLoaded,
    handleVimKeydown,
    handleKeystrokeReceived,
    validateSubmission,
    resignGame,
  };
};

export default useGameFunctions;
