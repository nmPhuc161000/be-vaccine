const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const {
  bookAppointment,
  getAppointments,
  cancelAppointment,
  updateAppointmentStatus,
} = require('../controllers/appointmentController');

// Đặt lịch hẹn
router.post('/book-appointment', auth, bookAppointment);

// Lấy danh sách lịch hẹn
router.get('/get-appointments', auth, getAppointments);

// Lấy thông tin cuộc hẹn theo ID
router.get('/get-appointment/:id', auth, getAppointmentById);

// Hủy lịch hẹn
router.put('/cancel-appointment/:id', auth, cancelAppointment);

// Cập nhật trạng thái lịch hẹn (ví dụ: từ pending sang confirmed)
router.put('/update-appointment-status/:id', auth, updateAppointmentStatus);

module.exports = router;