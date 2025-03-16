const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  console.log('Auth - Token:', token);

  if (!token) {
    console.log('Auth - No token');
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    console.log('Auth - JWT_SECRET:', process.env.JWT_SECRET);
    console.log('Auth - Current time:', Math.floor(Date.now() / 1000));
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Auth - Decoded:', decoded);
    req.user = decoded.user;
    console.log('Auth - User:', req.user);
    next();
  } catch (err) {
    console.error('Auth - Error:', err.name, err.message);
    res.status(401).json({ msg: 'Token is not valid', error: err.message });
  }
};

const checkRole = (roles) => {
  return (req, res, next) => {
    console.log('CheckRole - User:', req.user);
    if (!req.user || !req.user.role) {
      console.log('CheckRole - No user or role');
      return res.status(403).json({ msg: 'User data invalid' });
    }

    console.log('CheckRole - Role:', req.user.role, 'vs', roles);
    if (!roles.includes(req.user.role)) {
      console.log('CheckRole - Permission denied');
      return res.status(403).json({ msg: 'Permission denied' });
    }
    next();
  };
};

module.exports = { auth, checkRole }; // Export cả hai hàm