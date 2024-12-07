const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/book-seat', authMiddleware.verifyToken, bookingController.bookSeat);
router.get('/seat-availability', authMiddleware.verifyToken, bookingController.getSeatAvailability);
router.get('/user/:user_id', authMiddleware.verifyToken, bookingController.getUserBookings);

module.exports = router;
