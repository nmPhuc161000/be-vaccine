const Appointment = require('../models/Appointment');
const Child = require('../models/Child');
const Vaccine = require('../models/Vaccine');

exports.bookAppointment = async (req, res) => {
  const { childId, vaccineId, date } = req.body;

  try {
    // Kiểm tra xem childId, vaccineId, và date có được cung cấp không
    if (!childId || !vaccineId || !date) {
      return res.status(400).json({ msg: 'Vui lòng cung cấp childId, vaccineId và date' });
    }

    // Kiểm tra xem childId có tồn tại không
    const child = await Child.findById(childId);
    if (!child) {
      return res.status(404).json({ msg: 'Không tìm thấy trẻ' });
    }

    // Kiểm tra xem vaccineId có tồn tại không
    const vaccine = await Vaccine.findById(vaccineId);
    if (!vaccine) {
      return res.status(404).json({ msg: 'Không tìm thấy vaccine' });
    }

    // Kiểm tra xem ngày đặt lịch có hợp lệ không (không được là ngày trong quá khứ)
    const appointmentDate = new Date(date);
    if (appointmentDate < new Date()) {
      return res.status(400).json({ msg: 'Ngày hẹn không thể là ngày trong quá khứ' });
    }

    // Kiểm tra xem lịch hẹn có trùng với lịch đã có không
    const existingAppointment = await Appointment.findOne({
      childId,
      vaccineId,
      date: appointmentDate,
    });

    if (existingAppointment) {
      return res.status(400).json({ msg: 'Đã có lịch hẹn cho trẻ, vaccine và ngày này' });
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
      return res.status(400).json({ msg: 'Lỗi validation', errors });
    }

    // Xử lý lỗi khác
    res.status(500).json({ msg: 'Lỗi server', error: err.message });
  }
};

exports.getAppointments = async (req, res) => {
  try {
    const { childId, status, date } = req.query;

    // Log vai trò người dùng
    console.log('Vai trò người dùng:', req.user.role);
    
    // Tạo filter dựa trên vai trò của người dùng
    let filter = {};

    if (req.user.role === 'customer') {
      // Khách hàng chỉ được xem lịch hẹn của chính mình
      filter.userId = req.user.id;

      if (childId) {
        // Kiểm tra xem childId có thuộc về người dùng này không
        const child = await Child.findOne({ _id: childId, userId: req.user.id });
        if (!child) {
          return res.status(403).json({ msg: 'Bạn không có quyền xem thông tin trẻ này' });
        }

        filter.childId = childId;
      }
    } else if (req.user.role === 'staff' || req.user.role === 'admin') {
      // Nhân viên và admin có thể xem tất cả lịch hẹn
      if (childId) {
        filter.childId = childId;
      }
    } else {
      return res.status(403).json({ msg: 'Từ chối quyền truy cập' });
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
    res.status(500).json({ msg: 'Lỗi server', error: err.message });
  }
};

exports.getAppointmentById = async (req, res) => {
  try {
    const appointmentId = req.params.id;

    // Tìm cuộc hẹn theo ID
    const appointment = await Appointment.findById(appointmentId)
      .populate('childId', 'name dob')
      .populate('vaccineId', 'name price');

    // Kiểm tra xem cuộc hẹn có tồn tại không
    if (!appointment) {
      return res.status(404).json({ msg: 'Không tìm thấy lịch hẹn' });
    }

    // Kiểm tra quyền truy cập
    if (req.user.role === 'customer' && appointment.userId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Bạn không có quyền xem lịch hẹn này' });
    }

    // Trả về thông tin cuộc hẹn
    res.json(appointment);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Lỗi server', error: err.message });
  }
};

exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ msg: 'Không tìm thấy lịch hẹn' });
    }

    // Chỉ cho phép hủy lịch nếu trạng thái là pending
    if (appointment.status !== 'pending') {
      return res.status(400).json({ msg: 'Chỉ có thể hủy lịch hẹn đang ở trạng thái chờ' });
    }

    appointment.status = 'canceled';
    appointment.reminderSent = false; // Đặt lại reminderSent thành false
    await appointment.save();
    res.json({ msg: 'Lịch hẹn đã được hủy', appointment });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Lỗi server', error: err.message });
  }
};

exports.updateAppointmentStatus = async (req, res) => {
  const { status } = req.body;

  try {
    // Kiểm tra vai trò của người dùng
    if (req.user.role !== 'staff' && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Từ chối quyền truy cập. Chỉ nhân viên hoặc admin có thể cập nhật trạng thái lịch hẹn.' });
    }

    // Tìm cuộc hẹn theo ID
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ msg: 'Không tìm thấy lịch hẹn' });
    }

    // Cập nhật trạng thái
    appointment.status = status;
    await appointment.save();

    // Trả về thông tin cuộc hẹn đã cập nhật
    res.json({ msg: 'Trạng thái lịch hẹn đã được cập nhật', appointment });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Lỗi server', error: err.message });
  }
};