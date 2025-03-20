const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');

// Load env vars
dotenv.config();
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
// Connect to MongoDB
connectDB();

createAdminAccount();

const app = express();

// Body parser
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello world");
});
// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/user'));
app.use('/api/children', require('./routes/child'));
app.use('/api/appointments', require('./routes/appointment'));
app.use('/api/vaccines', require('./routes/vaccine'));
app.use('/api/feedbacks', require('./routes/feedback'));

// Export app cho Vercel
module.exports = app;