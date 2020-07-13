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

  addPlayer(id) {
    if (this.queue.get(id)) {
      this.debug('Warning: User with id "' + id + '" already in waiting queue');
    }
    this.queue.set(id, null);
  }

  getNextPlayers() {
    return [this.getNextPlayer(), this.getNextPlayer()];
  }

  getNextPlayer() {
    const [id] = this.queue.entries().next().value;

    this.removePlayerFromQueue(id);

    return id;
  }

  removePlayerFromQueue(id) {
    // if user not in queue, nothing happens
    this.queue.delete(id);
  }

  playerInQueue(id) {
    return this.queue.has(id);
  }

  size() {
    this.debug("Size of waiting queue: " + this.queue.size);
    return this.queue.size;
  }
}

module.exports = WaitingQueue;
