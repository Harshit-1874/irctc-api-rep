module.exports = (sequelize, DataTypes) => {
  const Train = sequelize.define("Train", {
    train_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    total_seats: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  Train.associate = (models) => {
    Train.belongsToMany(models.Station, {
      through: models.TrainRoute,
      foreignKey: "train_id",
    });
    Train.hasMany(models.Booking, { foreignKey: "train_id" });
  };

  return Train;
};
