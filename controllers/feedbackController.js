const Feedback = require('../models/Feedback');

exports.submitFeedback = async (req, res) => {
  const { appointmentId, rating, comment } = req.body;

  try {
    const feedback = new Feedback({
      userId: req.user.id,
      appointmentId,
      rating,
      comment,
    });
    await feedback.save();
    res.json(feedback);
  } catch (err) {
    res.status(500).send('Server error');
  }
};