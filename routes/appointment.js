const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { bookAppointment, getAppointments } = require('../controllers/appointmentController');

router.post('/book-appointment', auth, bookAppointment);
router.get('/get-appointments', auth, getAppointments);

module.exports = router;