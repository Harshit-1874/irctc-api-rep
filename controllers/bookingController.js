const { Train, Booking, Station, sequelize } = require('../models');

const bookingController = {
  // Book a seat on a specific train
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
          date 
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

      const newBooking = await Booking.create({
        user_id,
        train_id,
        date,
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
};

module.exports = bookingController;
