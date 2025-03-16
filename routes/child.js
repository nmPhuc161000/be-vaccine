const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
    addChild,
    getChildren,
    updateChild,
    deleteChild,
} = require('../controllers/childController');

// Thêm trẻ em
router.post('/add-child', auth, addChild);

// Lấy danh sách trẻ em
router.get('/get-children', auth, getChildren);

// Cập nhật thông tin trẻ em
router.put('/update-child/:id', auth, updateChild);

// Xóa trẻ em
router.delete('/delete-child/:id', auth, deleteChild);

module.exports = router;