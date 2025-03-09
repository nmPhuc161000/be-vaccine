const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Lấy thông tin người dùng hiện tại
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // Không trả về mật khẩu
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

// Cập nhật thông tin người dùng
exports.updateUserProfile = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Cập nhật thông tin
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

// Xóa tài khoản người dùng
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    await user.remove();
    res.json({ msg: 'User deleted' });
  } catch (err) {
    res.status(500).send('Server error');
  }
};