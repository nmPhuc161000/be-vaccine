const nodemailer = require('nodemailer');

// Cấu hình Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail', // Sử dụng dịch vụ Gmail
  auth: {
    user: process.env.EMAIL_USER, // Email của bạn
    pass: process.env.EMAIL_PASS, // Mật khẩu ứng dụng (App Password) của Gmail
  },
});

// Hàm gửi email nhắc nhở
const sendEmailReminder = async (email, appointmentDate) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Nhắc nhở lịch tiêm chủng',
    text: `Lịch tiêm chủng của bạn sẽ diễn ra vào ngày ${appointmentDate}. Vui lòng đến đúng giờ!`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email reminder sent to ${email}`);
  } catch (err) {
    console.error(`Error sending email to ${email}:`, err.message);
  }
};

module.exports = { sendEmailReminder };