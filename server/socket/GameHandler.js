const { v4: uuidv4 } = require("uuid");

class GameHandler {
  constructor(io, player1, player2, socket1, socket2, showDebug = false) {
    this.gameId = this.generateGameId();
    this.player1 = player1;
    this.player2 = player2;
    this.socket1 = socket1;
    this.socket2 = socket2;
    this.io = io;
    this.state = GameHandler.states.created;
    this.winner = null;
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
    if (this.state !== GameHandler.states.created) {
      this.debug("Game already initialized");
      throw "Game already initialized";
    }
    // set sockets to join this new game room
    this.socket1.join(this.gameId);
    this.socket2.join(this.gameId);

    this.addListeners();

    this.state = GameHandler.states.initialized;
  }

  onDisconnect(disconnectedPlayer) {
    this.debug(
      "Player " + this.player + " disconnected from game " + this.gameId
    );
    const gameWinner =
      disconnectedPlayer == this.player1 ? this.player2 : this.player1;
    this.finish(gameWinner);
  }

  // abstract to function to ensure correctly removed when game is finished
  onP1Disconnect() {
    this.debug("player 1 disconnected");
    this.onDisconnect(this.player1);
  }

  // abstract to function to ensure correctly removed when game is finished
  onP2Disconnect() {
    this.debug("player 2 disconnected");
    this.onDisconnect(this.player2);
  }

  onKeystroke(data) {
    // responds to keystroke from any player
    // emits to all players
    this.debug("Player " + data.username + " keystroke");
    this.io.in(this.gameId).emit("keystroke", data);
  }

  addListeners() {

    this.socket1.on("keystroke", this.onKeystroke);
    this.socket2.on("keystroke", this.onKeystroke);

    this.socket1.on("disconnect", this.onP1Disconnect);
    this.socket2.on("disconnect", this.onP2Disconnect);
  }

  removeListeners() {
    this.socket1.off("keystroke", this.onKeystroke);
    this.socket2.off("keystroke", this.onKeystroke);

    this.socket1.off("disconnect", this.onP1Disconnect);
    this.socket2.off("disconnect", this.onP2Disconnect);
  }

  start() {
    if (this.state !== GameHandler.states.initialized) {
      this.debug("Start method called before game was initialized");
      throw "Start method called before game was initialized";
    }

    this.debug("Game " + this.gameId + " started");
    // emit start to all users in game
    this.io.to(this.gameId).emit("start", {
      player1: this.player1,
      player2: this.player2,
      gameId: this.gameId,
    });
  }

  finish(winner) {
    this.debug("Game " + this.gameId + " ended");
    this.debug("Game " + this.gameId + " winner: " + winner);

    this.winner = winner;

    this.io.to(this.gameId).emit("finish", { winner: this.winner });

    this.state = GameHandler.states.finished;

    this.removeListeners();

    // remove sockets from previously created room
    this.socket1.leave(this.gameId);
    this.socket2.leave(this.gameId);
  }

  generateGameId() {
    return uuidv4();
  }
}

GameHandler.commands = ["start", "stop", "keystroke"];
GameHandler.states = {
  created: "created",
  initialized: "initialized",
  playing: "playing",
  finished: "finished",
};

module.exports = GameHandler;
