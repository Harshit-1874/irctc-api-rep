const express = require('express');
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/add-train', authMiddleware.verifyToken, authMiddleware.isAdmin, adminController.addTrain);
router.post('/add-station', authMiddleware.verifyToken, authMiddleware.isAdmin, adminController.addStation);


module.exports = router;
