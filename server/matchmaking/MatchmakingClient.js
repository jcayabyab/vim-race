const GameHandler = require("../game/GameHandler");
const WaitingQueue = require("./WaitingQueue");
const db = require("../db/api");
const { playerDict } = require("./PlayerDict");

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

  handleRequest(id, socket) {
    // store socket objects in queue for easy access
    this.waitingQueue.addPlayer(id);

    if (this.canCreateMatch()) {
      // pop two new objects
      const [id1, id2] = this.waitingQueue.getNextPlayers();

      console.log({ id1, id2 });

      const socket1 = playerDict.getSocket(id1);
      const socket2 = playerDict.getSocket(id2);

      // remove both players from any lobbies they may currently be in
      [
        [id1, socket1],
        [id2, socket2],
      ].forEach(([id, socket]) => {
        const game = playerDict.getGame(id);
        if (game) {
          // leave room
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

    playerDict.setPlayerGame(player1.id, game);
    playerDict.setPlayerGame(player2.id, game);

    game.start();
  }

  generateGameId() {
    return uuidv4();
  }

  playerIdActive(playerId) {
    let playerFinishedInGame = false;
    const playerGame = playerDict.getGame(playerId);
    if (playerGame) {
      const { player1, player2 } = playerGame.gameInfo;
      const thePlayer = player1.id === playerId ? player1 : player2;
      playerFinishedInGame = thePlayer.finished;
    }

    return (
      this.waitingQueue.playerInQueue() || (playerGame && !playerFinishedInGame)
    );
  }
}

module.exports = MatchmakingClient;
