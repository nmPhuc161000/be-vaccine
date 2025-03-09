const mongoose = require('mongoose');

const ChildSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  birthDate: { type: Date, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  medicalHistory: { type: String },
});

module.exports = mongoose.model('Child', ChildSchema);