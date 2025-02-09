const { DataTypes } = require("sequelize");
const { sequelize, models } = require("./db");
const { User, Game } = models;

module.exports = {
  findUserByGoogleId: async (googleId) => {
    try {
      const user = await User.findOne({
        where: {
          googleId,
        },
      });
      return user;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  findUserById: async (userId) => {
    try {
      const user = await User.findOne({
        where: {
          id: userId,
        },
      });
      return user;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  findUserByUsername: async (username) => {
    try {
      const user = await User.findOne({
        where: {
          username: username,
        },
      });
      return user;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  updateProfileInfo: async (user) => {
    const newUser = { ...user, usernameLastChanged: new Date() };

    return await User.update(newUser, {
      where: {
        id: user.id,
      },
      fields: ["username", "usernameLastChanged"],
    });
  },
  updateVimrc: async (userId, vimrcText) => {
    return await User.update(
      { vimrcText },
      {
        where: {
          id: userId,
        },
        fields: ["vimrcText"],
      }
    );
  },
  updateUserTimeById: async (userId) => {
    return await User.update(
      { lastSignInTime: new Date() },
      {
        where: {
          id: userId,
        },
      }
    );
  },
  createNewUserGoogle: async (googleId) => {
    try {
      const newUser = await User.create(
        {
          googleId: googleId.toString(),
          lastSignInTime: new Date(),
        },
        { fields: ["id", "lastSignInTime", "googleId"] }
      );
      return newUser;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
};
