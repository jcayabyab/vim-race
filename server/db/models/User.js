const { DataTypes, Model } = require("sequelize");

class User extends Model {}

module.exports = (sequelize) => {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
      },
      usernameLastChanged: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      lastSignInTime: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      vimrcText: {
        type: DataTypes.TEXT,
      },
      googleId: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "User",
      underscored: true,
      timestamps: false,
    }
  );
};
