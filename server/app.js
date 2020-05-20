const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 4001;
const index = require("./routes/index");

const app = express();
app.use(index);

const server = http.createServer(app);

const io = socketIo(server);

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("my_keystroke", (e) => {
    console.log(e);
    socket.emit("opponent_keystroke", e);
    socket.emit("my_keystroke", e);
  });

  socket.on("disconnect", () => {
    console.log("client disconnected");
  });
});

server.listen(port, () => console.log("Listening on port " + port));
