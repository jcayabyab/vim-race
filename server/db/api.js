const knex = require("./knex");

module.exports = {
  findUserByGoogleId: async (googleId) => {
    try {
      const user = await knex("users")
        .select()
        .where({ google_id: googleId })
        .first();
      console.log(user);
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  findUserById: (userId) => {
    return knex("users").select().where({ id: userId });
  },
  updateUserTimeById: (userId) => {
    return knex("users")
      .where({ id: userId })
      .update({ last_sign_in_time: new Date() });
  },
  createNewUserGoogle: async (googleId) => {
    try {
      const newUser = await knex("users").insert(
        { google_id: googleId, last_sign_in_time: new Date() },
        ["id", "email", "last_sign_in_time"]
      );
      return newUser[0];
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
};
