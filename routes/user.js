const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getUserProfile, updateUserProfile, deleteUser } = require('../controllers/userController');

// Lấy thông tin người dùng hiện tại
router.get('/me', auth, getUserProfile);

// Cập nhật thông tin người dùng
router.put('/me', auth, updateUserProfile);

// Xóa tài khoản người dùng
router.delete('/me', auth, deleteUser);

module.exports = router;