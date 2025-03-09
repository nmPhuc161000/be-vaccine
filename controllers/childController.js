const Child = require('../models/Child');

exports.addChild = async (req, res) => {
  const { name, birthDate, gender, medicalHistory } = req.body;

  try {
    const child = new Child({
      userId: req.user.id,
      name,
      birthDate,
      gender,
      medicalHistory,
    });
    await child.save();
    res.json(child);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.getChildren = async (req, res) => {
  try {
    const children = await Child.find({ userId: req.user.id });
    res.json(children);
  } catch (err) {
    res.status(500).send('Server error');
  }
};