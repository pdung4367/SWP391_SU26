const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middlewares/authMiddleware');
const isLandlord = require('../middlewares/isLandlord');

// All booking routes require authentication
router.use(authMiddleware);

router.post('/', bookingController.createBooking);
router.get('/', bookingController.getBookings);
router.put('/:id/status', isLandlord, bookingController.updateBookingStatus);

module.exports = router;
