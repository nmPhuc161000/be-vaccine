const mongoose = require('mongoose');

const ChildSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  birthDate: { type: Date, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  medicalHistory: { type: String, trim: true },
});

module.exports = mongoose.model('Child', ChildSchema);