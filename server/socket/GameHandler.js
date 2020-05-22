const { v4: uuidv4 } = require("uuid");
const GameInfo = require("./GameInfo");

class GameHandler {
  constructor(io, player1, player2, socket1, socket2, showDebug = false) {
    this.gameId = this.generateGameId();
    this.gameInfo = new GameInfo(player1, player2, this.generateGameId());
    this.socket1 = socket1;
    this.socket2 = socket2;
    this.io = io;
    this.showDebug = showDebug;

    // bind these - passed as callback functions
    this.onP1Disconnect = this.onP1Disconnect.bind(this);
    this.onP2Disconnect = this.onP2Disconnect.bind(this);
    this.onKeystroke = this.onKeystroke.bind(this);

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

  onDisconnect(disconnectedPlayer) {
    const { player1, player2, gameId } = this.gameInfo;

    this.debug(
      "Player " + disconnectedPlayer + " disconnected from game " + gameId
    );
    const gameWinner = disconnectedPlayer == player1 ? player2 : player1;
    this.finish(gameWinner);
  }

  // abstract to function to ensure correctly removed when game is finished
  onP1Disconnect() {
    this.debug("player 1 disconnected");
    this.onDisconnect(this.gameInfo.player1);
  }

  // abstract to function to ensure correctly removed when game is finished
  onP2Disconnect() {
    this.debug("player 2 disconnected");
    this.onDisconnect(this.gameInfo.player2);
  }

  onKeystroke(data) {
    // responds to keystroke from any player
    // emits to all players
    this.debug("Player " + data.username + " keystroke");
    this.io.in(this.gameInfo.gameId).emit(GameHandler.commands.KEYSTROKE, data);
  }

  addListeners() {
    this.socket1.on(GameHandler.commands.KEYSTROKE, this.onKeystroke);
    this.socket2.on(GameHandler.commands.KEYSTROKE, this.onKeystroke);

    this.socket1.on(GameHandler.commands.DISCONNECT, this.onP1Disconnect);
    this.socket2.on(GameHandler.commands.DISCONNECT, this.onP2Disconnect);
  }

  removeListeners() {
    this.socket1.off(GameHandler.commands.KEYSTROKE, this.onKeystroke);
    this.socket2.off(GameHandler.commands.KEYSTROKE, this.onKeystroke);

    this.socket1.off(GameHandler.commands.DISCONNECT, this.onP1Disconnect);
    this.socket2.off(GameHandler.commands.DISCONNECT, this.onP2Disconnect);
  }

  start() {
    const { state, gameId, player1, player2 } = this.gameInfo;

    if (state !== GameInfo.states.initialized) {
      this.debug("Start method called before game was initialized");
      throw "Start method called before game was initialized";
    }

    this.debug("Game " + gameId + " started");
    // emit start to all users in game
    this.io.to(gameId).emit(GameHandler.commands.START, {
      player1: player1,
      player2: player2,
      gameId: gameId,
    });
  }

  finish(winner) {
    const { gameId } = this.gameInfo;

    this.debug("Game " + gameId + " ended");
    this.debug("Game " + gameId + " winner: " + winner);

    this.gameInfo.winner = winner;

    this.io
      .to(gameId)
      .emit(GameHandler.commands.FINISH, { winner: this.gameInfo.winner });

    this.gameInfo.state = GameInfo.states.finished;

    this.removeListeners();

    // remove sockets from previously created room
    this.socket1.leave(gameId);
    this.socket2.leave(gameId);
  }

  generateGameId() {
    return uuidv4();
  }
}

GameHandler.commands = {
  START: "start",
  FINISH: "finish",
  KEYSTROKE: "keystroke",
  DISCONNECT: "disconnect",
};

module.exports = GameHandler;
