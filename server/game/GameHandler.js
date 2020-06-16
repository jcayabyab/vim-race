const { v4: uuidv4 } = require("uuid");
const GameInfo = require("./GameInfo");
const problemGenerator = require("../problem-generator/ProblemGenerator");
const Diff = require("diff");
const moment = require("moment");

class GameHandler {
  constructor(io, player1, player2, socket1, socket2, showDebug = false) {
    this.gameInfo = new GameInfo(
      this.generateGameId(),
      {
        ...player1.dataValues,
        loaded: false,
        finished: false,
        disconnected: false,
      },
      {
        ...player2.dataValues,
        loaded: false,
        finished: false,
        disconnected: false,
      }
    );
    this.socket1 = socket1;
    this.socket2 = socket2;
    this.io = io;
    this.showDebug = showDebug;
    this.generator = problemGenerator;

    const { start, goal } = this.generator.generateProblem();

    this.startText = start;
    this.goalText = goal;

    // bind these - passed as callback functions
    this.onDisconnect = this.onDisconnect.bind(this);
    this.onKeystroke = this.onKeystroke.bind(this);
    this.onSubmission = this.onSubmission.bind(this);
    this.onLoad = this.onLoad.bind(this);
    this.removeListeners = this.removeListeners.bind(this);

    if (showDebug) {
      console.log("GameHandler class in debug mode");
    }
  }

  debug(msg) {
    if (this.showDebug) {
      console.log(msg);
    }
  }

  initialize() {
    const { state, gameId } = this.gameInfo;

    if (state !== GameInfo.states.created) {
      this.debug("Game already initialized");
      throw "Game already initialized";
    }
    // set sockets to join this new game room
    this.socket1.join(gameId);
    this.socket2.join(gameId);

    this.addListeners();

    this.gameInfo.state = GameInfo.states.initialized;
  }

  onDisconnect() {
    const {
      socket1,
      gameInfo: { player1, player2, gameId },
    } = this;

    // find out who just disconnected
    const disconnectedPlayer =
      // if player1 just disconnected, then they will not be labeled finished
      // player1 might be labeled finished actually - how to fix?
      // if player has already disconnected, how to force to player 2?
      !socket1.connected && !player1.disconnected ? player1 : player2;

    this.debug(
      "Player " + disconnectedPlayer.id + " disconnected from game " + gameId
    );
    // manually set disconnected player finish, but do not set as winner
    disconnectedPlayer.finished = true;
    disconnectedPlayer.disconnected = true;
    this.handlePlayerFinish(disconnectedPlayer);
  }

  onKeystroke(data) {
    // responds to keystroke from any player
    // emits to all players
    // this.debug("Player " + data.id + " keystroke");
    this.io.in(this.gameInfo.gameId).emit(GameHandler.commands.KEYSTROKE, data);
  }

  onSubmission(data) {
    const {
      io,
      gameInfo: { gameId, player1, player2 },
      socket1,
      socket2,
    } = this;

    this.debug(data.id + " submitted: " + data.submission);
    if (data.submission.trim() === this.goalText.trim()) {
      // log player as finished - game goes until all players finish
      const finishedPlayer = data.id === player1.id ? player1 : player2;
      const finishedSocket = finishedPlayer === player1 ? socket1 : socket2;
      this.handlePlayerFinish(finishedPlayer, finishedSocket);
    } else {
      const diff = Diff.diffChars(data.submission.trim(), this.goalText.trim());

      // send bad submission to everyone
      io.to(gameId).emit(GameHandler.commands.FAIL, {
        submission: data.submission,
        id: data.id,
        diff,
      });
    }
  }

  // data: {id}
  onLoad(data) {
    const { player1, player2, gameId } = this.gameInfo;
    this.debug(data.id + " loaded");
    if (data.id === player1.id) {
      player1.loaded = true;
    }
    if (data.id === player2.id) {
      player2.loaded = true;
    }
    if (player1.loaded && player2.loaded) {
      // emit start to all users in game
      this.debug("Game " + gameId + " started");
      this.io.to(gameId).emit(GameHandler.commands.START);
    }
  }

  addListeners() {
    const {
      socket1,
      socket2,
      onKeystroke,
      onDisconnect,
      onSubmission,
      onLoad,
    } = this;

    socket1.on(GameHandler.commands.KEYSTROKE, onKeystroke);
    socket2.on(GameHandler.commands.KEYSTROKE, onKeystroke);

    socket1.on(GameHandler.commands.DISCONNECT, onDisconnect);
    socket2.on(GameHandler.commands.DISCONNECT, onDisconnect);

    socket1.on(GameHandler.commands.VALIDATE, onSubmission);
    socket2.on(GameHandler.commands.VALIDATE, onSubmission);

    socket1.on(GameHandler.commands.LOADED, onLoad);
    socket2.on(GameHandler.commands.LOADED, onLoad);
  }

  removeSocketListeners(socket) {
    const { onKeystroke, onDisconnect, onSubmission, onLoad } = this;
    socket.off(GameHandler.commands.KEYSTROKE, onKeystroke);
    socket.off(GameHandler.commands.DISCONNECT, onDisconnect);
    socket.off(GameHandler.commands.VALIDATE, onSubmission);
    socket.off(GameHandler.commands.LOADED, onLoad);
  }

  removeListeners() {
    const {
      socket1,
      socket2,
      onKeystroke,
      onDisconnect,
      onSubmission,
      onLoad,
    } = this;

    socket1.off(GameHandler.commands.KEYSTROKE, onKeystroke);
    socket2.off(GameHandler.commands.KEYSTROKE, onKeystroke);

    socket1.off(GameHandler.commands.DISCONNECT, onDisconnect);
    socket2.off(GameHandler.commands.DISCONNECT, onDisconnect);

    socket1.off(GameHandler.commands.VALIDATE, onSubmission);
    socket2.off(GameHandler.commands.VALIDATE, onSubmission);

    socket1.off(GameHandler.commands.LOADED, onLoad);
    socket2.off(GameHandler.commands.LOADED, onLoad);
  }

  start() {
    const { state, gameId, player1, player2 } = this.gameInfo;

    if (state !== GameInfo.states.initialized) {
      this.debug("Start method called before game was initialized");
      throw "Start method called before game was initialized";
    }

    this.debug("Game " + gameId + " waiting for clients to load");
    this.debug("Player IDs: " + player1.id + ", " + player2.id);

    const diff = Diff.diffChars(this.startText, this.goalText);

    // emit match found
    this.io.to(gameId).emit(GameHandler.commands.MATCH_FOUND, {
      player1,
      player2,
      gameId,
      startText: this.startText,
      goalText: this.goalText,
      diff,
    });
  }

  handlePlayerFinish(finishedPlayer, finishedSocket = null) {
    const {
      socket1,
      socket2,
      gameInfo: { player1, player2, gameId },
    } = this;

    this.debug(finishedPlayer.id + " finished");
    finishedPlayer.finished = true;
    // if first, then finished player is the winner
    if (!this.gameInfo.winner && !finishedPlayer.disconnected) {
      this.gameInfo.winner = finishedPlayer;
    }

    const formatTime = (ms) => {
      let seconds = ms / 1000;
      const minutes = Math.floor(seconds / 60);
      seconds = seconds % 60;
      return (
        minutes.toFixed(0).padStart(2, "0") +
        ":" +
        seconds.toFixed(2).padStart(2 + 3, "0")
      );
    };

    const completionTime = formatTime(moment().diff(this.gameInfo.timeStart));

    // broadcast that player has finished
    this.io.to(gameId).emit(GameHandler.commands.PLAYER_FINISH, {
      playerId: finishedPlayer.id,
      completionTime,
      disconnected: finishedPlayer.disconnected
    });

    // if both players are finished, then do logic
    if (player1.finished && player2.finished) {
      this.handleGameFinish();
    }
  }

  handleGameFinish() {
    const {
      gameInfo: { winner },
      io,
      socket1,
      socket2,
    } = this;

    this.debug("Game " + gameId + " ended");
    // if winner is null, both players disconnected
    if (gameInfo.winner) {
      this.debug("Game " + gameId + " winner: " + winner.id);

      io.to(gameId).emit(GameHandler.commands.GAME_FINISH);

      this.gameInfo.state = GameInfo.states.finished;

      this.removeListeners();

      // remove sockets from previously created room
      socket1.leave(gameId);
      socket2.leave(gameId);
    }
  }

  generateGameId() {
    return uuidv4();
  }
}

GameHandler.commands = {
  START: "start",
  GAME_FINISH: "game finish",
  PLAYER_FINISH: "player finish",
  KEYSTROKE: "keystroke",
  DISCONNECT: "disconnect",
  VALIDATE: "validate",
  FAIL: "fail",
  LOADED: "loaded",
  MATCH_FOUND: "match found",
};

module.exports = GameHandler;
