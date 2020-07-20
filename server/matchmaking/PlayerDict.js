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
    this.removeUserSentChallenges(id);
    this.removeUserReceivedChallenges(id);
  }

  removeUserSentChallenges(id) {
    const { sentChallenges } = this.dict[id];
    for (const challenge of [
      ...Object.values(sentChallenges),
    ]) {
      this.removeChallenge(challenge);
    }
  }

  removeUserReceivedChallenges(id) {
    const { receivedChallenges } = this.dict[id];
    for (const challenge of [
      ...Object.values(receivedChallenges),
    ]) {
      this.removeChallenge(challenge);
    }
  }

  getOtherUsersAndChallenges(id) {
    const otherUsersAndChallenges = {
      ...this.getOtherSentChallengeUsers(id),
      ...this.getOtherReceivedChallengeUsers(id),
    };

    return otherUsersAndChallenges;
  }

  getOtherSentChallengeUsers(id) {
    const { sentChallenges } = this.dict[id];
    const otherUsersAndChallenges = {};

    for (const challenge of Object.values(sentChallenges)) {
      if (!(challenge.receiverId in otherUsersAndChallenges)) {
        otherUsersAndChallenges[challenge.receiverId] = [];
      }
      otherUsersAndChallenges[challenge.receiverId].push(challenge);
    }

    return otherUsersAndChallenges;
  }

  getOtherReceivedChallengeUsers(id) {
    const { receivedChallenges } = this.dict[id];
    const otherUsersAndChallenges = {};

    for (const challenge of Object.values(receivedChallenges)) {
      if (!(challenge.senderId in otherUsersAndChallenges)) {
        otherUsersAndChallenges[challenge.senderId] = [];
      }
      otherUsersAndChallenges[challenge.senderId].push(challenge);
    }

    return otherUsersAndChallenges;
  }

  removePlayer(id) {
    if (this.dict[id]) {
      delete this.dict[id];
    }
  }

  getSocket(id) {
    if (this.playerOnline(id)) {
      return this.dict[id].socket;
    } else {
      throw "No key in this dictionary: " + id;
    }
  }

  getGame(id) {
    if (this.playerOnline(id)) {
      return this.dict[id].currentGame;
    } else {
      throw "No key in this dictionary: " + id;
    }
  }

  // called on connection
  // challenge objects: { challengeUuid: challenge }
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
    if (this.dict[id]) {
      this.dict[id].currentGame = gameHandler;
    }
  }

  removeGame(id) {
    if (this.dict[id]) {
      this.dict[id].currentGame = null;
    }
  }

  playerOnline(id) {
    return id in this.dict;
  }
}

// Singleton pattern
const playerDict = new PlayerDict();

module.exports = { playerDict: playerDict, PlayerDict };
