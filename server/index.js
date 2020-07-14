const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const MatchmakingClient = require("./matchmaking/MatchmakingClient");
const ChallengesClient = require("./challenges/ChallengesClient");
const { playerDict } = require("./matchmaking/PlayerDict");
const passport = require("passport");
const port = process.env.PORT || 4001;
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const keys = require("./config/keys");

const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const demoRoutes = require("./routes/demoRoutes");

// services
require("./services/passport");

const app = express();

const server = http.createServer(app);

const io = socketIo(server);
const matchmaker = new MatchmakingClient(io, true);
const challengesClient = new ChallengesClient(io);

app.use(bodyParser.json());
app.use(
  cookieSession({
    maxAge: 60 * 60 * 24 * 30 * 1000,
    keys: [keys.cookieKey],
  })
);
app.use(passport.initialize());
app.use(passport.session());

// app.use(indexRoutes);
app.use(authRoutes);
app.use(profileRoutes);
app.use(demoRoutes);

io.on("connection", (socket) => {
  // username of player - variables on a per-socket basis
  let id = null;

  socket.on("handshake", (data) => {
    console.log("client connected: ", data.id);
    id = data.id;
    playerDict.addPlayer(data.id, socket);
  });

  socket.on("disconnect", () => {
    console.log("client disconnected: " + id);
    // should have them leave the game here
    // also pop them off of waiting queue
    if (id) {
      matchmaker.waitingQueue.removePlayerFromQueue(id);
      const otherUsers = playerDict.handlePlayerDisconnect(id);
      challengesClient.notifyOnDisconnect(otherUsers);
    }
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
});

if (process.env.NODE_ENV === "production") {
  const path = require("path");
  const root = path.join(__dirname, "..", "build");
  app.use(express.static(root));
  app.get("*", (req, res) => {
    res.sendFile("index.html", { root });
  });
}

server.listen(port, () => console.log("Listening on port " + port));
