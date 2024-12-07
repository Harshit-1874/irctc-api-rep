module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define("Booking", {
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "Users",
        key: "id",
      },
    },
    train_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "Trains",
        key: "id",
      },
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    source_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "Stations",
        key: "id",
      },
    },
    destination_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "Stations",
        key: "id",
      },
    },
    seats_booked: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  Booking.associate = (models) => {
    Booking.belongsTo(models.User, { foreignKey: "user_id" });
    Booking.belongsTo(models.Train, { foreignKey: "train_id" });
  };

  return Booking;
};
