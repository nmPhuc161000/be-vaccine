const Appointment = require('../models/Appointment');

exports.bookAppointment = async (req, res) => {
  const { childId, vaccineId, date } = req.body;

  try {
    const appointment = new Appointment({
      userId: req.user.id,
      childId,
      vaccineId,
      date,
    });
    await appointment.save();
    res.json(appointment);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user.id }).populate('childId vaccineId');
    res.json(appointments);
  } catch (err) {
    res.status(500).send('Server error');
  }
};