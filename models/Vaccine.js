const mongoose = require('mongoose');

const VaccineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true, min: 0 }, // Giá phải là số dương
  ageRange: { type: String }, // Ví dụ: "0-6 tháng"
  image: { type: String } // Thêm trường image để lưu URL
});

module.exports = mongoose.model('Vaccine', VaccineSchema);