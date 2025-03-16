const Child = require('../models/Child');

exports.getChildren = async (req, res) => {
  try {
    let filter = {};

    // Nếu là khách hàng, chỉ lấy trẻ em của người dùng hiện tại
    if (req.user.role === 'customer') {
      filter.userId = req.user.id;
    }

    // Nếu là nhân viên hoặc admin, lấy tất cả trẻ em
    // (không cần thêm điều kiện vào filter)

    // Lấy danh sách trẻ em
    const children = await Child.find(filter)
      .populate('userId', 'name email'); // Populate thông tin người dùng (nếu cần)

    res.json(children);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};
exports.addChild = async (req, res) => {
  const { name, birthDate, gender, medicalHistory } = req.body;

  try {
    // Kiểm tra các trường bắt buộc
    if (!name || !birthDate) {
      return res.status(400).json({ msg: 'Name and birthDate are required' });
    }

    // Kiểm tra ngày sinh không được là ngày trong tương lai
    const currentDate = new Date();
    const childBirthDate = new Date(birthDate);

    if (childBirthDate > currentDate) {
      return res.status(400).json({ msg: 'Birth date cannot be in the future' });
    }

    // Tạo trẻ em mới
    const child = new Child({
      userId: req.user.id,
      name,
      birthDate: childBirthDate,
      gender,
      medicalHistory,
    });

    await child.save();
    res.json(child);
  } catch (err) {
    console.error(err.message);

    // Xử lý lỗi validation
    if (err.name === 'ValidationError') {
      const errors = {};
      for (const field in err.errors) {
        errors[field] = err.errors[field].message;
      }
      return res.status(400).json({ msg: 'Validation error', errors });
    }

    // Xử lý lỗi khác
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.updateChild = async (req, res) => {
  const { name, birthDate, gender, medicalHistory } = req.body;
  const { id } = req.params; // ID của trẻ em cần cập nhật

  try {
    // Tìm trẻ em theo ID và kiểm tra xem nó có thuộc về người dùng hiện tại không
    const child = await Child.findOne({ _id: id, userId: req.user.id });

    if (!child) {
      return res.status(404).json({ msg: 'Child not found or you do not have permission to update this child' });
    }

    // Cập nhật các trường nếu có trong body
    if (name) child.name = name;
    if (birthDate) {
      const newBirthDate = new Date(birthDate);
      if (newBirthDate > new Date()) {
        return res.status(400).json({ msg: 'Birth date cannot be in the future' });
      }
      child.birthDate = newBirthDate;
    }
    if (gender) child.gender = gender;
    if (medicalHistory) child.medicalHistory = medicalHistory;

    await child.save();
    res.json(child);
  } catch (err) {
    console.error(err.message);

    // Xử lý lỗi validation
    if (err.name === 'ValidationError') {
      const errors = {};
      for (const field in err.errors) {
        errors[field] = err.errors[field].message;
      }
      return res.status(400).json({ msg: 'Validation error', errors });
    }

    // Xử lý lỗi khác
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.deleteChild = async (req, res) => {
  const { id } = req.params; // ID của trẻ em cần xóa

  try {
    // Tìm trẻ em theo ID và kiểm tra xem nó có thuộc về người dùng hiện tại không
    const child = await Child.findOne({ _id: id, userId: req.user.id });

    if (!child) {
      return res.status(404).json({ msg: 'Child not found or you do not have permission to delete this child' });
    }

    // Xóa trẻ em
    await child.remove();
    res.json({ msg: 'Child deleted' });
  } catch (err) {
    console.error(err.message);

    // Xử lý lỗi khác
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};