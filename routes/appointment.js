const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { bookAppointment, getAppointments } = require('../controllers/appointmentController');

router.post('/', auth, bookAppointment);
router.get('/', auth, getAppointments);

module.exports = router;