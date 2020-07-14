const { playerDict } = require("../matchmaking/PlayerDict");
const Challenge = require("./Challenge");

class ChallengesClient {
  constructor(io, matchmakingClient) {
    this.io = io;

    this.matchmakingClient = matchmakingClient;

    this.onSend = this.onSend.bind(this);
    this.onDecline = this.onDecline.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onAccept = this.onAccept.bind(this);
  }

  addSocketListeners(socket) {
    socket.on(ChallengesClient.commands.SENT, this.onSend);
    socket.on(ChallengesClient.commands.DECLINE, this.onDecline);
    socket.on(ChallengesClient.commands.CANCEL, this.onCancel);
  }

  onSend(data) {
    // add sent challenge and received challenge
    const { senderId, receiverId } = data;
    const senderSocket = playerDict[senderId].socket;

    if (!playerDict.playerOnline(receiverId)) {
      senderSocket.emit(ChallengesClient.commands.CANNOT_SEND, {
        error: "Player is not online",
      });
      return;
    }

    const receiverSocket = playerDict[receiverId].socket;
    const challenge = new Challenge(senderId, receiverId);
    playerDict.addChallenge(challenge);
    senderSocket.emit(ChallengesClient.commands.SENT, challenge);
    receiverSocket.emit(ChallengesClient.commands.NEW_CHALLENGE, challenge);
  }

  onDecline(data) {
    // id of challenge receiver
    const { id, challengeUuid } = data;
    const challenge = playerDict.getChallengeByReceiverUuid(id, challengeUuid);
    playerDict.removeChallenge(challenge);

    const senderSocket = playerDict.getSocket(challenge.senderId);
    const receiverSocket = playerDict.getSocket(challenge.receiverId);
    senderSocket.emit(ChallengesClient.commands.REMOVE, { challenge });
    receiverSocket.emit(ChallengesClient.commands.REMOVE, { challenge });
  }

  onCancel(data) {
    // id of challenge sender
    const { id, challengeUuid } = data;
    const challenge = playerDict.getChallengeBySenderUuid(id, challengeUuid);
    playerDict.removeChallenge(challenge);

    const senderSocket = playerDict.getSocket(challenge.senderId);
    const receiverSocket = playerDict.getSocket(challenge.receiverId);
    senderSocket.emit(ChallengesClient.commands.REMOVE, { challenge });
    receiverSocket.emit(ChallengesClient.commands.REMOVE, { challenge });
  }

  async onAccept(data) {
    // id of challenge receiver
    const { id, challengeUuid } = data;

    const challenge = playerDict.getChallengeByReceiverUuid(id, challengeUuid);
    playerDict.removeChallenge(challenge);

    const senderSocket = playerDict.getSocket(challenge.senderId);
    const receiverSocket = playerDict.getSocket(challenge.receiverId);
    senderSocket.emit(ChallengesClient.commands.REMOVE, { challenge });
    receiverSocket.emit(ChallengesClient.commands.REMOVE, { challenge });

    await this.matchmakingClient.createMatch(
      challenge.senderId,
      challenge.receiverId,
      senderSocket,
      receiverSocket
    );
  }

  notifyOnDisconnect(otherUsers) {
    for (userId in otherUsers) {
      const socket = playerDict.getSocket(userId);
      socket.emit(ChallengesClient.REMOVE, { challenge });
    }
  }
}

ChallengesClient.commands = {
  NEW_CHALLENGE: "new challenge",
  SENT: "sent challenge",
  CANNOT_SEND: "cannot send challenge",
  REMOVE: "remove challenge",
  DECLINE: "decline challenge",
  CANCEL: "cancel challenge",
};

module.exports = ChallengesClient;
