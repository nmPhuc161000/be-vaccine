const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const {
  registerCustomer,
  registerStaff,
  login,
} = require('../controllers/authController');

// Đăng ký cho Customer (ai cũng có thể đăng ký)
router.post('/register-customer', registerCustomer);

// Đăng ký cho Staff (chỉ Admin có quyền)
router.post('/register-staff', [auth, checkRole(['admin'])], registerStaff);

// Đăng nhập
router.post('/login', login);

module.exports = router;