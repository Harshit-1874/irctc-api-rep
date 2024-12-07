const { Train, Booking, TrainRoute, Station, sequelize } = require('../models');

const bookingController = {
  bookSeat: async (req, res) => {
    const { train_id, seats_booked, date, source_id, destination_id } = req.body;
    const user_id = req.user.id;
    
    if (!train_id || !seats_booked || !date || !source_id || !destination_id) {
      return res.status(400).json({ message: 'Train ID, number of seats, date, source and destination are required.' });
    }

    if (seats_booked <= 0) {
      return res.status(400).json({ message: 'Seats booked should be greater than 0.' });
    }

    const t = await sequelize.transaction();

    try {
      const train = await Train.findByPk(train_id, { transaction: t });
      if (!train) {
        return res.status(404).json({ message: 'Train not found.' });
      }

      const availableSeats = train.total_seats - await Booking.sum('seats_booked', { 
        where: { 
          train_id, 
          booking_date: date 
        }, 
        transaction: t 
      });

      if (seats_booked > availableSeats) {
        return res.status(400).json({ message: 'Not enough available seats for the selected date.' });
      }

      const sourceStation = await Station.findByPk(source_id, { transaction: t });
      const destinationStation = await Station.findByPk(destination_id, { transaction: t });

      if (!sourceStation || !destinationStation) {
        return res.status(404).json({ message: 'Invalid source or destination station.' });
      }

      console.log(date);

      const newBooking = await Booking.create({
        user_id,
        train_id,
        booking_date: date,
        source_id,
        destination_id,
        seats_booked,
        createdAt: new Date(),
        updatedAt: new Date(),
      }, { transaction: t });

      await t.commit();

      res.status(201).json({
        message: 'Seats booked successfully.',
        booking: newBooking,
      });

    } catch (error) {
      await t.rollback();
      console.error(error);
      res.status(500).json({ message: 'Failed to book seats. Please try again later.' });
    }
  },

  getSeatAvailability : async (req, res) => {
    const { source_id, destination_id, date } = req.query;
  
    if (!source_id || !destination_id || !date) {
      return res.status(400).json({ message: 'Source, destination, and date are required.' });
    }
  
    try {
      const routes = await TrainRoute.findAll({
        attributes: ['train_id'],
        where: sequelize.and(
          sequelize.literal(`EXISTS (
            SELECT 1 FROM "TrainRoutes" AS "R1"
            WHERE "R1"."train_id" = "TrainRoute"."train_id"
            AND "R1"."station_id" = ${source_id}
          )`),
          sequelize.literal(`EXISTS (
            SELECT 1 FROM "TrainRoutes" AS "R2"
            WHERE "R2"."train_id" = "TrainRoute"."train_id"
            AND "R2"."station_id" = ${destination_id}
            AND "R2"."sequence" > (
              SELECT "sequence" FROM "TrainRoutes" WHERE "station_id" = ${source_id} AND "train_id" = "TrainRoute"."train_id"
            )
          )`)
        )
      });
  
      if (!routes.length) {
        return res.status(404).json({ message: 'No trains available for the specified route.' });
      }
  
      const trainIds = routes.map(route => route.train_id);
  
      const trains = await Train.findAll({
        where: { id: trainIds },
        include: [
          {
            model: Booking,
            attributes: ['seats_booked'],
            where: {booking_date:  date },
            required: false,
          }
        ]
      });
  
      const results = trains.map(train => {
        const totalBookedSeats = train.Bookings.reduce((sum, booking) => sum + booking.seats_booked, 0);
        return {
          train_id: train.id,
          train_name: train.train_name,
          available_seats: train.total_seats - totalBookedSeats,
        };
      });
  
      res.status(200).json(results);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch seat availability.' });
    }
  },

  getUserBookings: async (req, res) => {
    const { user_id } = req.params;

    try {
      const bookings = await Booking.findAll({
        where: { user_id },
        include: [
          {
            model: Train,
            attributes: ['id', 'train_name'],
          },
        ],
      });

      if (!bookings.length) {
        return res.status(404).json({ message: 'No bookings found for the given user ID.' });
      }

      res.status(200).json({ bookings });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch booking details.' });
    }
  },
};

module.exports = bookingController;
