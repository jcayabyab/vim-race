const keys = require("../config/keys");
const knex = require("knex")({
  client: "pg",
  connection: keys.postgresURI,
  searchPath: ["vimrace-dev", "public"],
});

module.exports = knex;
