const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const { v4: uuidv4 } = require("uuid");

const port = process.env.PORT || 4001;
const index = require("./routes/index");

const app = express();
app.use(index);

const server = http.createServer(app);

const io = socketIo(server);

const waitingQueue = [];

const createMatch = (player1, player2) => {
  console.log(
    "creating match between " +
      player1.username +
      " and " +
      player2.username
  );

  const gameId = uuidv4();
  player1.socket.join(gameId);
  player2.socket.join(gameId);
  io.to(gameId).emit("start", {
    player1: player1.username,
    player2: player2.username,
    gameId,
  });
};

// set 2 players for example
io.on("connection", (socket) => {
  console.log("New client connected");
  socket.emit("welcome", {
    msg: "Welcome player ",
    playerId: 20,
  });

  socket.on("keystroke", (data) => {
    console.log(data);
    console.log("Player " + data.username + " keystroke");
    io.in(data.gameId).emit("keystroke", data);
  });

  socket.on("disconnect", () => {
    console.log("client disconnected");
  });

  socket.on("request match", (data) => {
    console.log(data.username + " requested match");
    // matchmaking logic
    // get username and add to queue
    waitingQueue.push({ username: data.username, socket });
    if (waitingQueue.length >= 2) {
      console.log(waitingQueue);
      // get two players
      const player1 = waitingQueue.shift();
      const player2 = waitingQueue.shift();
      createMatch(player1, player2);
    }
  });
});

server.listen(port, () => console.log("Listening on port " + port));
