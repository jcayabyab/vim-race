/**
 * Keep track of socket objects for each user ID.
 */
class PlayerDict {
  constructor() {
    this.dict = {};
  }

  handlePlayerDisconnect(id) {
    const otherUsersAndChallenges = this.getOtherUsersAndChallenges(id);
    this.removeUserChallenges(id);
    this.removePlayer(id);
    return otherUsersAndChallenges;
  }

  removeUserChallenges(id) {
    const { sentChallenges, receivedChallenges } = this.dict[id];
    for (const challenge in [
      ...Object.values(sentChallenges),
      ...Object.values(receivedChallenges),
    ]) {
      this.removeChallenge(challenge);
    }
  }

  getOtherUsersAndChallenges(id) {
    const { sentChallenges, receivedChallenges } = this.dict[id];
    // for each challenge return the socket of the user
    const otherUsersAndChallenges = {};
    for (const challenge in Object.values(sentChallenges)) {
      if (!challenge.receiverId in otherUsers) {
        otherUsers[challenge.receiverId] = [];
      }
      otherUsers[challenge.receiverId].push(challenge);
    }
    for (const challenge in Object.values(receivedChallenges)) {
      if (!challenge.senderId in otherUsers) {
        otherUsers[challenge.senderId] = [];
      }
      otherUsers[challenge.senderId].push(challenge);
    }

    return otherUsersAndChallenges;
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
