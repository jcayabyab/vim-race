import React, { useState, createContext } from "react";
import { GAME_STATES } from "../states";
import usePlayerStates from "../hooks/usePlayerStates";

export const GameClientContext = createContext();

export const GameClientStateProvider = (props) => {
  const [gameState, setGameState] = useState(GAME_STATES.IDLE);
  const [opponent, setOpponent] = useState(null);
  const [startText, setStartText] = useState(null);
  const [goalText, setGoalText] = useState(null);
  const [diff, setDiff] = useState([]);
  const [userInitialized, setUserInitialized] = useState(false);
  const [opponentInitialized, setOpponentInitialized] = useState(false);
  const [lobbyTerminalLoaded, setLobbyTerminalLoaded] = useState(false);
  // used to stop timer once game is over
  const [prevGameFinished, setPrevGameFinished] = useState(false);

  const [playerStates, setNewPlayers, setPlayerState] = usePlayerStates();
  const [loginDetected, setLoginDetected] = useState(false);
  const [serverDisconnected, setServerDisconnected] = useState(false);

  // prettier-ignore
  const gameStateObj = {
    gameState, setGameState,
    opponent, setOpponent,
    startText, setStartText,
    goalText, setGoalText,
    diff, setDiff,
    userInitialized, setUserInitialized,
    opponentInitialized, setOpponentInitialized,
    lobbyTerminalLoaded, setLobbyTerminalLoaded,
    prevGameFinished, setPrevGameFinished,
    playerStates, setNewPlayers, setPlayerState,
    loginDetected, setLoginDetected,
    serverDisconnected, setServerDisconnected,
  };

  return (
    <GameClientContext.Provider value={gameStateObj}>
      {props.children}
    </GameClientContext.Provider>
  );
};
