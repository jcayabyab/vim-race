const GameHandler = require("../game/GameHandler");
const WaitingQueue = require("./WaitingQueue");

class MatchmakingClient {
  constructor(io, showDebug = false) {
    this.io = io;
    // stores player usernames and their respective socket objects.
    this.waitingQueue = new WaitingQueue(true);
    this.showDebug = showDebug;

    if (showDebug) {
      console.log("MatchmakingClient class in debug mode");
    }
  }

  debug(msg) {
    if (this.showDebug) {
      console.log(msg);
    }
  }

  handleRequest(username, socket) {
    // store socket objects in queue for easy access
    this.waitingQueue.addPlayer(username, socket);

    if (this.canCreateMatch()) {
      // pop two new objects
      const [
        name1,
        socket1,
        name2,
        socket2,
      ] = this.waitingQueue.getNextPlayers();

      this.createMatch(name1, name2, socket1, socket2);
    }
  }

  canCreateMatch() {
    return this.waitingQueue.size() >= 2;
  }

  createMatch(name1, name2, socket1, socket2) {
    this.debug("creating match between " + name1 + " and " + name2);

    // generate random game id
    const game = new GameHandler(this.io, name1, name2, socket1, socket2, true);

    game.initialize();
    game.start();
  }

  generateGameId() {
    return uuidv4();
  }
}

module.exports = MatchmakingClient;
