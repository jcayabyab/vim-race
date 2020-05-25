class GameInfo {
  constructor(player1, player2, gameId) {
    this.player1 = player1;
    this.player2 = player2;
    this.state = GameInfo.states.created;
    this.gameId = gameId;
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
