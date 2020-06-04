const GameHandler = require("../game/GameHandler");
const WaitingQueue = require("./WaitingQueue");
const db = require("../db/api");

class MatchmakingClient {
  constructor(io, showDebug = false) {
    this.io = io;
    // stores player usernames and their respective socket objects.
    this.waitingQueue = new WaitingQueue(true);
    this.showDebug = showDebug;
    this.playersInGame = new Set();
    if (showDebug) {
      console.log("MatchmakingClient class in debug mode");
    }

    this.onFinish = this.onFinish.bind(this);
  }

  debug(msg) {
    if (this.showDebug) {
      console.log(msg);
    }
  }

  handleRequest(id, socket) {
    // store socket objects in queue for easy access
    this.waitingQueue.addPlayer(id, socket);

    if (this.canCreateMatch()) {
      // pop two new objects
      const [id1, socket1, id2, socket2] = this.waitingQueue.getNextPlayers();

      this.createMatch(id1, id2, socket1, socket2);
    }
  }

  canCreateMatch() {
    return this.waitingQueue.size() >= 2;
  }

  /**
   * Callback function to notify the matchmaking client that these users can join
   * another game
   * @param {*} game The game that has finished
   */
  onFinish(game) {
    const { player1, player2 } = game.gameInfo;
    this.playersInGame.delete(player1.id);
    this.playersInGame.delete(player2.id);
  }

  async createMatch(id1, id2, socket1, socket2) {
    this.debug("creating match between users with ids " + id1 + " and " + id2);

    // get players from database
    const player1 = await db.findUserById(id1);
    const player2 = await db.findUserById(id2);

    // generate random game id
    const game = new GameHandler(
      this.io,
      player1,
      player2,
      socket1,
      socket2,
      this.onFinish,
      true
    );

    game.initialize();

    // add to queue
    this.playersInGame.add(player1.id);
    this.playersInGame.add(player2.id);

    game.start();
  }

  generateGameId() {
    return uuidv4();
  }

  playerIdActive(playerId) {
    return (
      this.waitingQueue.playerInQueue() || this.playersInGame.has(playerId)
    );
  }
}

module.exports = MatchmakingClient;
