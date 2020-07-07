import { useState, useCallback } from "react";
import { PLAYER_STATES } from "../states";

const usePlayerStates = () => {
  const [playerStates, setPlayerStates] = useState({});
  // handle previous logic for callbacks

  const setPlayerState = useCallback(
    (id, newState, completionTime = null, placement = null) => {
      // handle race condition
      setPlayerStates((prevState) => {
        // if player already finished or resigned, do not update on disconnect
        if (
          prevState[id].state === PLAYER_STATES.SUCCESS ||
          prevState[id].state === PLAYER_STATES.RESIGNED
        ) {
          return prevState;
        } else {
          const newPlayerState = { state: newState, placement };
          if (
            newState === PLAYER_STATES.SUCCESS ||
            newState === PLAYER_STATES.RESIGNED
          ) {
            newPlayerState.completionTime = completionTime;
          }

          return { ...prevState, [id]: newPlayerState };
        }
      });
    },
    [setPlayerStates]
  );

  const setNewPlayers = useCallback(
    (ids) => {
      const newPlayerStates = {};
      ids.forEach(
        (id) => (newPlayerStates[id] = { state: PLAYER_STATES.PLAYING })
      );

      setPlayerStates(newPlayerStates);
    },
    [setPlayerStates]
  );

  return [playerStates, setNewPlayers, setPlayerState];
};

export default usePlayerStates;
