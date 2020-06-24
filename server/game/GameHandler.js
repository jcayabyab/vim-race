const { v4: uuidv4 } = require("uuid");
const GameInfo = require("./GameInfo");
const problemGenerator = require("../problem-generator/ProblemGenerator");
const Diff = require("diff");
const moment = require("moment");
const { formatTime } = require("../utils");

class GameHandler {
  constructor(io, player1, player2, socket1, socket2, showDebug = false) {
    this.gameInfo = new GameInfo(
      this.generateGameId(),
      {
        ...player1.dataValues,
        loaded: false,
        finished: false,
        disconnected: false,
        resigned: false,
      },
      {
        ...player2.dataValues,
        loaded: false,
        finished: false,
        disconnected: false,
        resigned: false,
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

    // keep track of placement of users as they finish
    this.finishedUsers = 0;

    // bind these - passed as callback functions
    this.onDisconnect = this.onDisconnect.bind(this);
    this.onKeystroke = this.onKeystroke.bind(this);
    this.onSubmission = this.onSubmission.bind(this);
    this.onLoad = this.onLoad.bind(this);
    this.removeListeners = this.removeListeners.bind(this);
    this.onResign = this.onResign.bind(this);

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
    const {
      gameInfo: { gameId },
      socket1,
      socket2,
    } = this;

    if (this.gameInfo.state !== GameInfo.states.created) {
      this.debug("Game already initialized");
      throw "Game already initialized";
    }
    // set sockets to join this new game room
    socket1.join(gameId);
    socket2.join(gameId);

    this.addSocketListeners(socket1);
    this.addSocketListeners(socket2);

    this.gameInfo.state = GameInfo.states.initialized;
  }

  onDisconnect() {
    const {
      socket1,
      gameInfo: { player1, player2, gameId },
    } = this;

    // find out who just disconnected
    const disconnectedPlayer =
      // if player1 already marked as disconnected, then player2 is disconnected
      socket1.disconnected && !player1.disconnected ? player1 : player2;

    this.debug(
      "Player " + disconnectedPlayer.id + " disconnected from game " + gameId
    );
    disconnectedPlayer.disconnected = true;

    // if player disconnects having already finished, don't do anything
    if (!disconnectedPlayer.finished) {
      this.handlePlayerFinish(disconnectedPlayer);
    }
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
      gameInfo: { gameId },
    } = this;

    this.debug(data.id + " submitted: " + data.submission);
    if (data.submission.trim() === this.goalText.trim()) {
      // log player as finished - game goes until all players finish
      const [finishedPlayer, finishedSocket] = this.getPlayerAndSocketById(
        data.id
      );
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

  onResign(data) {
    this.debug(data.id + " resigned");

    const [resignedPlayer] = this.getPlayerAndSocketById(data.id);

    resignedPlayer.resigned = true;

    this.handlePlayerFinish(resignedPlayer);
  }

  // data: {id}
  onLoad(data) {
    const { player1, player2, gameId } = this.gameInfo;
    this.debug(data.id + " loaded");
    const [loadedPlayer] = this.getPlayerAndSocketById(data.id);
    loadedPlayer.loaded = true;
    if (player1.loaded && player2.loaded) {
      // emit start to all users in game
      this.debug("Game " + gameId + " started");
      this.io.to(gameId).emit(GameHandler.commands.START);
    }
  }

  addSocketListeners(socket) {
    const { onKeystroke, onDisconnect, onSubmission, onLoad, onResign } = this;
    socket.on(GameHandler.commands.KEYSTROKE, onKeystroke);
    socket.on(GameHandler.commands.DISCONNECT, onDisconnect);
    socket.on(GameHandler.commands.VALIDATE, onSubmission);
    socket.on(GameHandler.commands.LOADED, onLoad);
    socket.on(GameHandler.commands.RESIGN, onResign);
  }

  removeSocketListeners(socket) {
    const { onKeystroke, onDisconnect, onSubmission, onLoad, onResign } = this;
    socket.off(GameHandler.commands.KEYSTROKE, onKeystroke);
    socket.off(GameHandler.commands.DISCONNECT, onDisconnect);
    socket.off(GameHandler.commands.VALIDATE, onSubmission);
    socket.off(GameHandler.commands.LOADED, onLoad);
    socket.off(GameHandler.commands.RESIGN, onResign);
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

  handlePlayerFinish(finishedPlayer) {
    const {
      gameInfo: { player1, player2, gameId },
    } = this;

    this.debug(finishedPlayer.id + " finished");
    finishedPlayer.finished = true;

    const playerCompletionTime = formatTime(
      moment().diff(this.gameInfo.timeStart)
    );

    /* resign and disconnect logic for placement */
    const otherPlayer = finishedPlayer === player1 ? player2 : player1;
    const lastRemaining = otherPlayer.resigned || otherPlayer.disconnected;

    // if other player disconnected or resigned, treat a resign or disconnect as "accept win"
    const validWin =
      (!finishedPlayer.disconnected && !finishedPlayer.resigned) ||
      lastRemaining;

    if (validWin) {
      if (!this.gameInfo.winner) {
        this.gameInfo.winner = finishedPlayer;
      }
      this.finishedUsers++;
    }

    const placement = validWin ? this.finishedUsers : null;
    // broadcast that player has finished
    this.io.to(gameId).emit(GameHandler.commands.PLAYER_FINISH, {
      playerId: finishedPlayer.id,
      completionTime: playerCompletionTime,
      disconnected: finishedPlayer.disconnected,
      resigned: finishedPlayer.resigned,
      placement,
    });

    // if both players are finished, then do game ending logic
    if (player1.finished && player2.finished) {
      this.handleGameFinish();
    }
  }

  handleGameFinish() {
    const {
      gameInfo: { winner, gameId },
      io,
      socket1,
      socket2,
    } = this;

    this.debug("Game " + gameId + " ended");
    this.gameInfo.state = GameInfo.states.finished;

    // if winner is null, both players disconnected -> don't need to remove from room
    if (winner) {
      this.debug("Game " + gameId + " winner: " + winner.id);
      io.to(gameId).emit(GameHandler.commands.GAME_FINISH);

      this.removeListeners();

      // remove sockets from previously created room
      socket1.leave(gameId);
      socket2.leave(gameId);
    }
  }

  generateGameId() {
    return uuidv4();
  }

  getPlayerAndSocketById(id) {
    const {
      gameInfo: { player1, player2 },
      socket1,
      socket2,
    } = this;
    const player = player1.id === id ? player1 : player2;
    const socket = player === player1 ? socket1 : socket2;
    return [player, socket];
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
  RESIGN: "resign",
};

module.exports = GameHandler;
