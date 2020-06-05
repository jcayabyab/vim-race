const { DataTypes, Model } = require("sequelize");

class Game extends Model {}

module.exports = (sequelize) => {
  Game.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      timePlayed: {
        type: DataTypes.DATE,
      },
      player1Id: {
        type: DataTypes.STRING,
      },
      player2Id: {
        type: DataTypes.STRING,
      },
      player1Winner: {
        type: DataTypes.BOOLEAN,
      },
      state: {
        type: DataTypes.STRING,
        defaultValue: "created",
      },
    },
    {
      sequelize,
      modelName: "Game",
      underscored: true,
    }
  );
};
