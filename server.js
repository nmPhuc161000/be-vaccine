const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/user')); // Đảm bảo dòng này có mặt
app.use('/api/children', require('./routes/child'));
app.use('/api/appointments', require('./routes/appointment'));
app.use('/api/vaccines', require('./routes/vaccine'));
app.use('/api/feedbacks', require('./routes/feedback'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});