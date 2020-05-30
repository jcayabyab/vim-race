class GameInfo {
  constructor(gameId, player1, player2) {
    this.gameId = gameId;
    this.player1 = player1;
    this.player2 = player2;
    this.state = GameInfo.states.created;
    this.winner = null;
  }
}

GameInfo.states = {
  created: "created",
  initialized: "initialized",
  playing: "playing",
  finished: "finished",
};

module.exports = GameInfo;
