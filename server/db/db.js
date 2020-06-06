const keys = require("../config/keys");
const Sequelize = require("sequelize");

// init database connection
const sequelize = new Sequelize(keys.postgresURI, {
  schema: "vimrace-dev",
  logging: false,
});

sequelize
  .authenticate()
  .then(() => console.log("Postgres connection established"))
  .catch((err) => console.error("Unable to connect to database: ", err));

require("./models/Game")(sequelize);
require("./models/User")(sequelize);

const { User, Game } = sequelize.models;

// define table relationships
User.hasMany(Game);
Game.belongsTo(User, {
  as: "player1_id",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

Game.belongsTo(User, {
  as: "player2_id",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

// sync with postgres instance
sequelize
  .sync()
  .then(() => console.log("Database synchronized"))
  .catch((err) => console.log("Database sync failed: ", err));

module.exports = {
  sequelize,
  models: sequelize.models,
};
