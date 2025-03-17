const cron = require('node-cron');
const Appointment = require('../models/Appointment');
const { sendEmailReminder } = require('./mailer');

// Lập lịch kiểm tra và gửi thông báo mỗi ngày
cron.schedule('0 * * * *', async () => { // Chạy mỗi giờ (có thể thay đổi thành '0 8 * * *' để chạy mỗi ngày lúc 8 giờ sáng)
  try {
    // Lấy thời gian hiện tại
    const now = new Date();

    // Tính thời gian 24 giờ sau
    const twentyFourHoursLater = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Lấy tất cả các lịch hẹn diễn ra trong vòng 24 giờ tới
    const appointments = await Appointment.find({
      date: { $lte: twentyFourHoursLater, $gt: now }, // Lịch hẹn trong vòng 24 giờ tới
      reminderSent: false, // Chưa gửi thông báo
    }).populate('userId', 'email'); // Lấy thông tin email của người dùng

    // Gửi thông báo cho từng lịch hẹn
    for (const appointment of appointments) {
      const { userId, date } = appointment;

      // Gửi email nhắc nhở
      if (userId.email) {
        await sendEmailReminder(userId.email, date);
      }

      // Cập nhật reminderSent thành true
      appointment.reminderSent = true;
      await appointment.save();
    }
  } catch (err) {
    console.error('Error scheduling reminders:', err.message);
  }
});

console.log('Reminder scheduler is running...');