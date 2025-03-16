const Appointment = require('../models/Appointment');
const Child = require('../models/Child');
const Vaccine = require('../models/Vaccine');

exports.bookAppointment = async (req, res) => {
  const { childId, vaccineId, date } = req.body;

  try {
    // Kiểm tra xem childId, vaccineId, và date có được cung cấp không
    if (!childId || !vaccineId || !date) {
      return res.status(400).json({ msg: 'Please provide childId, vaccineId, and date' });
    }

    // Kiểm tra xem childId có tồn tại không
    const child = await Child.findById(childId);
    if (!child) {
      return res.status(404).json({ msg: 'Child not found' });
    }

    // Kiểm tra xem vaccineId có tồn tại không
    const vaccine = await Vaccine.findById(vaccineId);
    if (!vaccine) {
      return res.status(404).json({ msg: 'Vaccine not found' });
    }

    // Kiểm tra xem ngày đặt lịch có hợp lệ không (không được là ngày trong quá khứ)
    const appointmentDate = new Date(date);
    if (appointmentDate < new Date()) {
      return res.status(400).json({ msg: 'Appointment date cannot be in the past' });
    }

    // Kiểm tra xem lịch hẹn có trùng với lịch đã có không
    const existingAppointment = await Appointment.findOne({
      childId,
      vaccineId,
      date: appointmentDate,
    });

    if (existingAppointment) {
      return res.status(400).json({ msg: 'An appointment already exists for this child, vaccine, and date' });
    }

    // Tạo lịch hẹn mới
    const appointment = new Appointment({
      userId: req.user.id,
      childId,
      vaccineId,
      date: appointmentDate,
      status: 'pending',
      paymentStatus: 'unpaid',
    });

    await appointment.save();
    res.json(appointment);
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

exports.getAppointments = async (req, res) => {
  try {
    const { childId, status, date } = req.query;

    // Tạo filter dựa trên vai trò của người dùng
    let filter = {};

    if (req.user.role === 'customer') {
      // Khách hàng chỉ được xem lịch hẹn của chính mình
      filter.userId = req.user.id;

      if (childId) {
        // Kiểm tra xem childId có thuộc về người dùng này không
        const child = await Child.findOne({ _id: childId, userId: req.user.id });
        if (!child) {
          return res.status(403).json({ msg: 'You do not have permission to view this child' });
        }

        filter.childId = childId;
      }
    } else if (req.user.role === 'staff' || req.user.role === 'admin') {
      // Nhân viên và admin có thể xem tất cả lịch hẹn
      if (childId) {
        filter.childId = childId;
      }
    } else {
      return res.status(403).json({ msg: 'Permission denied' });
    }

    // Lọc theo trạng thái và ngày (nếu có)
    if (status) {
      filter.status = status;
    }

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      filter.date = { $gte: startOfDay, $lte: endOfDay };
    }

    // Lấy danh sách lịch hẹn
    const appointments = await Appointment.find(filter)
      .populate('childId', 'name dob')
      .populate('vaccineId', 'name price');

    res.json(appointments);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ msg: 'Appointment not found' });
    }

    // Chỉ cho phép hủy lịch nếu trạng thái là pending
    if (appointment.status !== 'pending') {
      return res.status(400).json({ msg: 'Only pending appointments can be canceled' });
    }

    appointment.status = 'canceled';
    await appointment.save();
    res.json({ msg: 'Appointment canceled', appointment });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.updateAppointmentStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ msg: 'Appointment not found' });
    }

    // Cập nhật trạng thái
    appointment.status = status;
    await appointment.save();
    res.json({ msg: 'Appointment status updated', appointment });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};