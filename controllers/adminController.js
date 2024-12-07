const { Train, Station, Sequelize, TrainRoute } = require('../models');
const { Op } = Sequelize;

const adminController = {
  addTrain: async (req, res) => {
    try {
      const { train_name, total_seats, routeDetails } = req.body;

      if (!train_name || !total_seats || !routeDetails || routeDetails.length === 0) {
        return res.status(400).json({ message: 'Please provide all required fields.' });
      }

      const newTrain = await Train.create({
        train_name,
        total_seats,
      });

      const trainRoutePromises = routeDetails.map(async (route, index) => {
        const { station_id, sequence } = route;

        const station = await Station.findByPk(station_id);
        if (!station) {
          throw new Error(`Station with id ${station_id} not found`);
        }

        await TrainRoute.create({
          train_id: newTrain.id,
          station_id,
          sequence: sequence || index + 1,
        });
      });

      await Promise.all(trainRoutePromises);

      res.status(201).json({
        message: 'Train and its routes added successfully',
        train: newTrain,
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  },
  addStation: async (req, res) => {
    try {
      const { name, code } = req.body;

      if (!name || !code) {
        return res.status(400).json({ message: 'Both station name and code are required.' });
      }

      const existingStation = await Station.findOne({
        where: {
          [Op.or]: [{ name }, { code }],
        },
      });

      if (existingStation) {
        return res.status(400).json({ message: 'Station name or code already exists.' });
      }

      const newStation = await Station.create({ name, code });
      res.status(201).json({ message: 'Station added successfully.', station: newStation });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error.' });
    }
  },
};

module.exports = adminController;
