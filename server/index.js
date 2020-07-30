const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const MatchmakingClient = require("./matchmaking/MatchmakingClient");
const ChallengesClient = require("./challenges/ChallengesClient");
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
const challengesClient = new ChallengesClient(io, matchmaker);

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

const getSocketInitializer = require("./socket");
const initializeSocket = getSocketInitializer(challengesClient, matchmaker);

io.on("connection", initializeSocket);

if (process.env.NODE_ENV === "production") {
  const path = require("path");
  const root = path.join(__dirname, "..", "build");
  app.use(express.static(root));
  app.get("*", (req, res) => {
    res.sendFile("index.html", { root });
  });
}

server.listen(port, () => console.log("Listening on port " + port));
