const Vaccine = require('../models/Vaccine');

exports.getVaccines = async (req, res) => {
  try {
    const vaccines = await Vaccine.find().sort({ name: 1 }); // Sắp xếp theo tên
    res.json(vaccines);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.getVaccineById = async (req, res) => {
  try {
    const vaccine = await Vaccine.findById(req.params.id);
    if (!vaccine) {
      return res.status(404).json({ msg: 'Vaccine not found' });
    }

    res.json(vaccine);
  } catch (err) {
    console.error(err.message);

    // Xử lý lỗi ID không hợp lệ
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Invalid vaccine ID' });
    }

    // Xử lý lỗi khác
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.addVaccine = async (req, res) => {
  const { name, description, price, ageRange, image } = req.body;
  console.log('Received request:', req.body);

  try {
    if (!name || !price) {
      return res.status(400).json({ msg: 'Name and price are required' });
    }

    const vaccine = new Vaccine({
      name,
      description,
      price,
      ageRange,
      image,
    });

    await vaccine.save();
    res.json(vaccine);
  } catch (err) {
    console.error(err.message);

    // Xử lý lỗi validation
    if (err.name === 'ValidationError') {
      const errors = {};
      for (const field in err.errors) {
        errors[field] = err.errors[field].message; // Lấy thông báo lỗi cho từng trường
      }
      return res.status(400).json({ msg: 'Validation error', errors });
    }

    // Xử lý lỗi khác
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.updateVaccine = async (req, res) => {
  const { name, description, price, ageRange, image } = req.body;

  try {
    const vaccine = await Vaccine.findById(req.params.id);
    if (!vaccine) {
      return res.status(404).json({ msg: 'Vaccine not found' });
    }

    // Cập nhật các field nếu có trong body
    if (name) vaccine.name = name;
    if (description) vaccine.description = description;
    if (price) vaccine.price = price;
    if (ageRange) vaccine.ageRange = ageRange;
    if (image) vaccine.image = image;

    await vaccine.save();
    res.json(vaccine);
  } catch (err) {
    console.error(err.message);

    // Xử lý lỗi validation
    if (err.name === 'ValidationError') {
      const errors = {};
      for (const field in err.errors) {
        errors[field] = err.errors[field].message; // Lấy thông báo lỗi cho từng trường
      }
      return res.status(400).json({ msg: 'Validation error', errors });
    }

    // Xử lý lỗi khác
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.deleteVaccine = async (req, res) => {
  try {
    const vaccine = await Vaccine.findByIdAndDelete(req.params.id);
    if (!vaccine) {
      return res.status(404).json({ msg: 'Vaccine not found' });
    }

    res.json({ msg: 'Vaccine deleted' });
  } catch (err) {
    console.error(err.message);

    // Xử lý lỗi ID không hợp lệ
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Invalid vaccine ID' });
    }

    // Xử lý lỗi khác
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};