const mongoose = require('mongoose');

const VaccineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  ageRange: { type: String }, // Ví dụ: "0-6 tháng"
});

module.exports = mongoose.model('Vaccine', VaccineSchema);