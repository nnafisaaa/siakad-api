const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const conn = require('./config/db');
// jika auth.js dan config ada di folder yang sama (siakad)
const { body, validationResult } = require('express-validator');
const router = express.Router();

// =====================================
// REGISTER - POST /auth/register
// =====================================
router.post(
  '/auth/register',
  [
    body('email')
      .isEmail()
      .withMessage('Invalid email format'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map((err) => err.msg),
      });
    }

    const { email, password } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const query = 'INSERT INTO user (email, password) VALUES (?, ?)';
      conn.query(query, [email, hashedPassword], (err, result) => {
        if (err) {
          if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
              success: false,
              message: 'Email already registered',
            });
          }
          return res.status(500).json({ success: false, message: err.sqlMessage });
        }

        return res.status(201).json({
          success: true,
          message: 'User registered successfully',
        });
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
);

// =====================================
// LOGIN - POST /auth/login
// =====================================
router.post(
  '/auth/login',
  [
    body('email')
      .isEmail()
      .withMessage('Invalid email format'),
    body('password')
      .notEmpty()
      .withMessage('Password is required'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map((err) => err.msg),
      });
    }

    const { email, password } = req.body;

    const query = 'SELECT * FROM user WHERE email = ?';
    conn.query(query, [email], async (err, results) => {
      if (err || results.length === 0) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        'secretkey123',
        { expiresIn: '1h' }
      );

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
      });
    });
  }
);

// =====================================
// Middleware - JWT Check
// =====================================
function verifyToken(req, res, next) {
  const bearerHeader = req.headers.authorization;

  if (!bearerHeader || !bearerHeader.startsWith('Bearer ')) {
    return res.status(403).json({ message: 'Token missing or invalid' });
  }

  const token = bearerHeader.split(' ')[1];

  jwt.verify(token, 'secretkey123', (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Token verification failed' });
    }

    req.user = decoded;
    next();
  });
}

// =====================================
// GET /profile (Protected)
// =====================================
router.get('/profile', verifyToken, (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Access granted',
    user: req.user,
  });
});

module.exports = router;
