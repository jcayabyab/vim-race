/**
 * Keep track of socket objects for each user ID.
 */
class PlayerDict {
  constructor() {
    this.dict = {};
  }

  removePlayer(id) {
    delete this.dict[id];
  }

  getSocket(id) {
    if (id in this.dict) {
      return this.dict[id].socket;
    } else {
      throw "No key in this dictionary: " + id;
    }
  }

  getGame(id) {
    return this.dict[id].currentGame;
  }

  // called on connection
  addPlayer(id, socket) {
    this.dict[id] = { socket, currentGame: null };
  }

  setPlayerGame(id, gameHandler) {
    this.dict[id].currentGame = gameHandler;
  }

  removeGame(id) {
    this.dict[id].currentGame = null;
  }
}

// Singleton pattern
const playerDict = new PlayerDict();

module.exports = { playerDict: playerDict, PlayerDict };
