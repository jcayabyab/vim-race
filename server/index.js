const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const MatchmakingClient = require("./matchmaking/MatchmakingClient");
const passport = require("passport");
const port = process.env.PORT || 4001;
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const keys = require("./config/keys");

const indexRoutes = require("./routes/index");
const authRoutes = require("./routes/authRoutes");

// services
require("./services/passport");

const app = express();

const server = http.createServer(app);

const io = socketIo(server);
const matchmaker = new MatchmakingClient(io, true);

app.use(bodyParser.json());
app.use(
  cookieSession({
    maxAge: 60 * 60 * 24 * 30 * 1000,
    keys: [keys.cookieKey],
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(indexRoutes);
app.use(authRoutes);

io.on("connection", (socket) => {
  // username of player - variables on a per-socket basis
  let username = null;
  let idle = true;

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
    const id = data.id;
    if (idle) {
      // prevent user from connecting multiple times
      console.log(data.username + " requested match");
      // matchmaking logic
      matchmaker.handleRequest(id, socket);
      // need a way to check if user is searching or playing a game quickly
      idle = false;
    } else {
      console.log("user already connected as " + id);
    }
  });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

server.listen(port, () => console.log("Listening on port " + port));
