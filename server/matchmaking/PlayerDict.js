/**
 * Keep track of socket objects for each user ID.
 */
class PlayerDict {
  constructor() {
    this.dict = {};
  }

  handlePlayerDisconnect(id) {
    const otherUsers = getOtherUsersChallenged(id);
    removeUserChallenges(id);
    removePlayer(id);
    return otherUsers;
  }

  removeUserChallenges(id) {
    const { sentChallenges, receivedChallenges } = this.dict[id];
    for (challenge in [...sentChallenges, ...receivedChallenges]) {
      removeChallenge(challenge);
    }
  }

  getOtherUsersChallenged(id) {
    const { sentChallenges, receivedChallenges } = this.dict[id];
    // for each challenge return the socket of the user
    const otherUsers = [];
    for (challenge in Object.values(sentChallenges)) {
      otherUsers.append(challenge.receiverId);
    }
    for (challenge in Object.values(receivedChallenges)) {
      otherUsers.append(challenge.senderId);
    }

    return otherUsers;
  }

  removePlayer(id) {
    delete this.dict[id];
  }

  getSocket(id) {
    if (this.playerOnline(id)) {
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
    this.dict[id] = {
      socket,
      currentGame: null,
      sentChallenges: {},
      receivedChallenges: {},
    };
  }

  addChallenge(challenge) {
    const { senderId, receiverId } = challenge;
    this.dict[senderId].sentChallenges[challenge.uuid] = challenge;
    this.dict[receiverId].receivedChallenges[challenge.uuid] = challenge;
  }

  getChallengeBySenderUuid(senderId, challengeUuid) {
    const challenge = this.dict[senderId].sentChallenges[challengeUuid];

    return challenge;
  }

  getChallengeByReceiverUuid(receiverUuid, challengeUuid) {
    const challenge = this.dict[receiverUuid].receivedChallenges[challengeUuid];

    return challenge;
  }

  removeChallenge(challenge) {
    const { senderId, receiverId } = challenge;
    delete this.dict[senderId].sentChallenges[challenge.uuid];
    delete this.dict[receiverId].receivedChallenges[challenge.uuid];
  }

  setPlayerGame(id, gameHandler) {
    this.dict[id].currentGame = gameHandler;
  }

  removeGame(id) {
    this.dict[id].currentGame = null;
  }

  playerOnline(id) {
    return id in this.dict;
  }
}

// Singleton pattern
const playerDict = new PlayerDict();

module.exports = { playerDict: playerDict, PlayerDict };
