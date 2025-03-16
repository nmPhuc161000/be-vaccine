const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');
const PORT = process.env.PORT || 5000;

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(helmet()); // Bảo mật các HTTP headers
app.use(express.json({ limit: '10kb' })); // Giới hạn kích thước request body

// Hàm tạo tài khoản Admin
const createAdminAccount = async () => {
  try {
    // Kiểm tra xem đã có tài khoản Admin chưa
    const admin = await User.findOne({ role: 'admin' });

    if (!admin) {
      // Tạo tài khoản Admin mặc định
      const adminUser = new User({
        name: 'Admin',
        email: 'admin@example.com',
        password: 'admin123', // Mật khẩu mặc định
        role: 'admin',
      });

      // Mã hóa mật khẩu
      const salt = await bcrypt.genSalt(10);
      adminUser.password = await bcrypt.hash(adminUser.password, salt);

      // Lưu tài khoản Admin
      await adminUser.save();
      console.log('Admin account created successfully');
    } else {
      console.log('Admin account already exists');
    }
  } catch (err) {
    console.error('Error creating admin account:', err.message);
  }
};

// Kết nối MongoDB và khởi chạy server
const startServer = async () => {
  try {
    await connectDB(); // Kết nối MongoDB
    console.log('MongoDB connected');

    // Tạo tài khoản Admin nếu chưa tồn tại
    await createAdminAccount();

    // Routes
    app.use('/api/auth', require('./routes/auth'));
    app.use('/api/users', require('./routes/user'));
    app.use('/api/children', require('./routes/child'));
    app.use('/api/appointments', require('./routes/appointment'));
    app.use('/api/vaccines', require('./routes/vaccine'));
    app.use('/api/feedbacks', require('./routes/feedback'));

    // Middleware xử lý lỗi toàn cục
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ msg: 'Something went wrong on the server' });
    });

    // Khởi chạy server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1); // Thoát ứng dụng nếu không kết nối được MongoDB
  }
};

// Khởi chạy server
startServer();

module.exports = app;