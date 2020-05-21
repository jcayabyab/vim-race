const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 4001;
const index = require("./routes/index");

const app = express();
app.use(index);

const server = http.createServer(app);

const io = socketIo(server);

let playerCount = 0;

// set 2 players for example
io.on("connection", (socket) => {
  console.log("New client connected");
  playerCount += 1;
  console.log(playerCount);
  socket.emit("welcome", {
    msg: "Welcome player " + playerCount,
    playerId: playerCount,
  });

  socket.on("keystroke", (data) => {
    console.log(data);
    console.log("Player " + data.playerId + " keystroke");
    socket.emit("keystroke", data);
    socket.broadcast.emit("keystroke", data);
  });

  socket.on("disconnect", () => {
    console.log("client disconnected");
    playerCount -= 1;
  });
});

server.listen(port, () => console.log("Listening on port " + port));
