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
const profileRoutes = require("./routes/profileRoutes");

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
app.use(profileRoutes);

io.on("connection", (socket) => {
  // username of player - variables on a per-socket basis
  let id = null;

  socket.on("disconnect", () => {
    console.log("client disconnected: " + id);
    // should have them leave the game here
    // also pop them off of waiting queue
    if (id) {
      matchmaker.waitingQueue.removePlayerFromQueue(id);
    }
  });

  // data: { username: String }
  socket.on("request match", (data) => {
    id = data.id;
    if (matchmaker.playerIdActive(id)) {
      console.log("user already connected as " + id);
    } else {
      // prevent user from connecting multiple times
      console.log(data.username + " requested match");
      // matchmaking logic
      matchmaker.handleRequest(id, socket);
    }
  });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static("../build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

server.listen(port, () => console.log("Listening on port " + port));
