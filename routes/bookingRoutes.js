const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/book-seat', authMiddleware, bookingController.bookSeat);

module.exports = router;
