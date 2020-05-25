class WaitingQueue {
  constructor(showDebug = false) {
    // Map sorts by order of insertion
    this.queue = new Map();
    this.showDebug = showDebug;
  }

  debug(msg) {
    if (this.showDebug) {
      console.log(msg);
    }
  }

  addPlayer(username, socket) {
    if (this.queue.get(username)) {
      this.debug('Warning: User "' + username + '" already in waiting queue');
    }
    this.queue.set(username, socket);
  }

  getNextPlayers() {
    return [...this.getNextPlayer(), ...this.getNextPlayer()];
  }

  getNextPlayer() {
    const [username, socket] = this.queue.entries().next().value;

    this.removePlayerFromQueue(username);

    return [username, socket];
  }

  removePlayerFromQueue(username) {
    // if user not in queue, nothing happens
    this.queue.delete(username);
  }

  size() {
    this.debug("Size of waiting queue: " + this.queue.size);
    return this.queue.size;
  }
}

module.exports = WaitingQueue;
