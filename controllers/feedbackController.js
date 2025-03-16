const Feedback = require('../models/Feedback');

exports.submitFeedback = async (req, res) => {
  const { appointmentId, rating, comment, reaction } = req.body;

  try {
    // Validation
    if (!appointmentId || !rating) {
      return res.status(400).json({ msg: 'Appointment ID and rating are required' });
    }

    const feedback = new Feedback({
      userId: req.user.id, // Lấy từ token
      appointmentId,
      rating,
      comment,
      reaction,
    });

    await feedback.save();
    res.json(feedback);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.viewFeedbacks = async (req, res) => {
  try {
    let feedbacks;

    if (req.user.role === 'customer') {
      // Customer xem feedback của riêng họ
      feedbacks = await Feedback.find({ userId: req.user.id })
        .populate('appointmentId', 'date vaccineId')
        .sort({ createdAt: -1 });
    } else if (['staff', 'admin'].includes(req.user.role)) {
      // Staff và Admin xem tất cả feedback
      feedbacks = await Feedback.find()
        .populate('userId', 'name email')
        .populate('appointmentId', 'date vaccineId')
        .sort({ createdAt: -1 });
    } else {
      return res.status(403).json({ msg: 'Permission denied' });
    }

    res.json(feedbacks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.viewPublicFeedbacks = async (req, res) => {
  try {
    // Trả về feedback công khai, ẩn thông tin nhạy cảm
    const feedbacks = await Feedback.find()
      .select('rating comment reaction createdAt') // Chỉ lấy các trường công khai
      .populate('appointmentId', 'vaccineId') // Lấy vaccineId để nhóm theo vắc-xin
      .sort({ createdAt: -1 });

    // Tùy chọn: Ẩn reaction nếu nhạy cảm
    const publicFeedbacks = feedbacks.map(feedback => ({
      rating: feedback.rating,
      comment: feedback.comment,
      vaccineId: feedback.appointmentId?.vaccineId, // Gắn với vắc-xin
      createdAt: feedback.createdAt,
    }));

    res.json(publicFeedbacks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};