module.exports = (sequelize, DataTypes) => {
  const Station = sequelize.define("Station", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });

  Station.associate = (models) => {
    Station.belongsToMany(models.Train, {
      through: models.TrainRoute,
      foreignKey: "station_id",
    });
  };

  return Station;
};
