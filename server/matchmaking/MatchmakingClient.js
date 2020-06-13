const GameHandler = require("../game/GameHandler");
const WaitingQueue = require("./WaitingQueue");
const db = require("../db/api");

class MatchmakingClient {
  constructor(io, showDebug = false) {
    this.io = io;
    // stores player usernames and their respective socket objects.
    this.waitingQueue = new WaitingQueue(true);
    this.showDebug = showDebug;
    this.playersInGame = {};
    if (showDebug) {
      console.log("MatchmakingClient class in debug mode");
    }
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

      [
        [id1, socket1],
        [id2, socket2],
      ].forEach(([id, socket]) => {
        if (this.playersInGame.hasOwnProperty(id)) {
          // leave room
          const game = this.playersInGame[id];
          socket.leave(game.gameInfo.gameId);
          // remove listeners from previous game
          game.removeSocketListeners(socket);
        }
      });

      this.createMatch(id1, id2, socket1, socket2);
    }
  }

  canCreateMatch() {
    return this.waitingQueue.size() >= 2;
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
      true
    );

    game.initialize();

    // add to queue
    this.playersInGame[player1.id] = game;
    this.playersInGame[player2.id] = game;

    game.start();
  }

  generateGameId() {
    return uuidv4();
  }

  playerIdActive(playerId) {
    let playerFinishedInGame = false;
    const playerInGame = this.playersInGame.hasOwnProperty(playerId);
    if (playerInGame) {
      const game = this.playersInGame[playerId];
      const { player1, player2 } = game.gameInfo;
      const thePlayer = player1.id === playerId ? player1 : player2;
      playerFinishedInGame = thePlayer.finished;
    }

    return (
      this.waitingQueue.playerInQueue() ||
      (playerInGame && !playerFinishedInGame)
    );
  }
}

module.exports = MatchmakingClient;
