const { playerDict } = require("./matchmaking/PlayerDict");

module.exports = (challengesClient, matchmaker) => {
  return (socket) => {
    // username of player - variables on a per-socket basis
    let id = null;

    socket.on("handshake", (data) => {
      console.log("client connected: ", data.id);
      id = data.id;
      if (playerDict.playerOnline(id)) {
        const otherSocket = playerDict.getSocket(id);
        playerDict.addPlayer(id, socket);
        otherSocket.emit("login detected");
      } else {
        playerDict.addPlayer(id, socket);
      }
    });

    socket.on("disconnect", () => {
      console.log("client disconnected: " + id);
      if (id) {
        matchmaker.waitingQueue.removePlayerFromQueue(id);
        const otherUsersAndChallenges = playerDict.handlePlayerDisconnect(id);
        challengesClient.notifyOnRemoveOtherChallenges(otherUsersAndChallenges);
      }
      console.log(playerDict.dict);
    });

    // data: { id: String }
    socket.on("request match", (data) => {
      id = data.id;
      if (matchmaker.playerIdActive(id)) {
        console.log("user already connected as " + id);
      } else {
        // prevent user from connecting multiple times
        console.log(data.id + " requested match");
        // matchmaking logic
        matchmaker.handleRequest(id, socket);
      }
    });

    socket.on("cancel matchmaking", (data) => {
      matchmaker.waitingQueue.removePlayerFromQueue(data.id);
    });

    challengesClient.addSocketListeners(socket);
  };
};
