const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.registerCustomer = async (req, res) => {
  const { name, email, password } = req.body;

  console.log('Register Customer - Request body:', req.body);

  if (!name || !email || !password) {
    return res.status(400).json({ msg: 'Please enter all required fields' });
  }

  try {
    let user = await User.findOne({ email });
    console.log('Register Customer - Existing user:', user);
    if (user) return res.status(400).json({ msg: 'User already exists' });

    user = new User({ name, email, password, role: 'customer' }); // Mặc định role là 'customer'
    console.log('Register Customer - New user:', user);

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    console.log('Register Customer - Saving user...');
    await user.save();
    console.log('Register Customer - User saved');

    const payload = { user: { id: user.id, role: user.role } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    console.error('Register Customer - Error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.registerStaff = async (req, res) => {
  const { name, email, password } = req.body;

  console.log('Register Staff - Request body:', req.body);

  if (!name || !email || !password) {
    return res.status(400).json({ msg: 'Please enter all required fields' });
  }

  try {
    // Kiểm tra xem email đã tồn tại chưa
    let user = await User.findOne({ email });
    console.log('Register Staff - Existing user:', user);
    if (user) return res.status(400).json({ msg: 'User already exists' });

    // Tạo user mới với role là 'staff'
    user = new User({ name, email, password, role: 'staff' });
    console.log('Register Staff - New user:', user);

    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Lưu user vào database
    console.log('Register Staff - Saving user...');
    await user.save();
    console.log('Register Staff - User saved');

    // Tạo token và trả về cho client
    const payload = { user: { id: user.id, role: user.role } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    console.error('Register Staff - Error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = { user: { id: user.id, email: user.email , name: user.name ,role: user.role } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    res.status(500).send('Server error');
  }
};