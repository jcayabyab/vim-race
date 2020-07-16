const { v4: uuidv4 } = require("uuid");

class Challenge {
  constructor(senderId, senderUsername, receiverId, receiverUsername) {
    this.senderId = senderId;
    this.senderUsername = senderUsername;
    this.receiverId = receiverId;
    this.receiverUsername = receiverUsername;
    this.timestamp = new Date();
    this.uuid = uuidv4();
  }
}

module.exports = Challenge;
