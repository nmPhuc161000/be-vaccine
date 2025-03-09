const Vaccine = require('../models/Vaccine');

exports.getVaccines = async (req, res) => {
  try {
    const vaccines = await Vaccine.find();
    res.json(vaccines);
  } catch (err) {
    res.status(500).send('Server error');
  }
};