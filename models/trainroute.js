module.exports = (sequelize, DataTypes) => {
  const TrainRoute = sequelize.define("TrainRoute", {
    train_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "Trains",
        key: "id",
      },
    },
    station_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "Stations",
        key: "id",
      },
    },
    sequence: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  return TrainRoute;
};
