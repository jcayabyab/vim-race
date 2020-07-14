const { v4: uuidv4 } = require("uuid");

class Challenge {
  constructor(senderId, receiverId) {
    this.senderId = senderId;
    this.receiverId = receiverId;
    this.timestamp = new Date();
    this.uuid = uuidv4();
  }
}

module.exports = Challenge;
