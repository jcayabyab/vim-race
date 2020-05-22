const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const MatchmakingClient = require("./socket/MatchmakingClient");

const port = process.env.PORT || 4001;
const index = require("./routes/index");

const app = express();
app.use(index);

const server = http.createServer(app);

const io = socketIo(server);
const matchmaker = new MatchmakingClient(io, true);

io.on("connection", (socket) => {
  // username of player - variables on a per-socket basis
  let username = null;

  socket.on("disconnect", () => {
    console.log("client disconnected: " + username);
    // should have them leave the game here
    // also pop them off of waiting queue
    if (username) {
      matchmaker.waitingQueue.removePlayerFromQueue(username);
    }
  });

  // data: { username: String }
  socket.on("request match", (data) => {
    // prevent user from connecting multiple times
    if (!username) {
      username = data.username;
      console.log(data.username + " requested match");
      // matchmaking logic
      matchmaker.handleRequest(data.username, socket);
    }
    else {
      console.log("user already connected as " + username);
    }
  });
});

server.listen(port, () => console.log("Listening on port " + port));
