import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { body, query } from 'express-validator';
import handleValidation from '../middleware/handleValidation.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import User from '../models/User.js';
import nodemailer from "nodemailer";
import crypto from "crypto";

const router = express.Router();

// ✅ Temporary OTP store (in-memory JS object)
const otpStore = {}; 
// Structure: { "email@example.com": { otp: 123456, expires: 1693655460000, verified: false } }

// ================== OTP ROUTES ==================

// POST /api/auth/send-otp
router.post('/send-otp', async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999);

    // Save OTP in memory for 5 minutes
    otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000, verified: false };

    // Setup nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your gmail
        pass: process.env.EMAIL_PASS, // app password
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
    });

    res.json({ msg: "OTP sent successfully" });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/verify-otp
router.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;

  const record = otpStore[email];
  if (!record) {
    return res.status(400).json({ msg: "OTP not requested" });
  }

  if (Date.now() > record.expires) {
    delete otpStore[email];
    return res.status(400).json({ msg: "OTP expired" });
  }

  if (parseInt(otp) === record.otp) {
    otpStore[email].verified = true;
    return res.json({ msg: "OTP verified" });
  }

  res.status(400).json({ msg: "Invalid OTP" });
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res, next) => {
  try {
    const { email, newPassword } = req.body;

    const record = otpStore[email];
    if (!record || !record.verified) {
      return res.status(400).json({ msg: "OTP not verified" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { password: hashedPassword }
    );

    delete otpStore[email]; // cleanup

    res.json({ msg: "Password reset successful" });
  } catch (err) {
    next(err);
  }
});

// ================== EXISTING ROUTES ==================

// Test route to verify auth routes are working
router.get('/test', (req, res) => {
  res.json({ msg: 'Auth routes are working!' });
});

/**
 * GET /api/auth/check-username?username=amal
 */
router.get(
  '/check-username',
  [ query('username').trim().isLength({ min: 3 }).withMessage('Username required') ],
  handleValidation,
  async (req, res, next) => {
    try {
      const exists = await User.exists({ username: req.query.username });
      return res.json({ available: !exists });
    } catch (e) { next(e); }
  }
);

/**
 * GET /api/auth/check-email?email=test@example.com
 */
router.get(
  '/check-email',
  [ query('email').isEmail().withMessage('Valid email required') ],
  handleValidation,
  async (req, res, next) => {
    try {
      const exists = await User.exists({ email: req.query.email.toLowerCase() });
      return res.json({ available: !exists });
    } catch (e) { next(e); }
  }
);

/**
 * GET /api/auth/users (Admin only)
 */
router.get('/users', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (e) {
    next(e);
  }
});

/**
 * PUT /api/auth/users/:userId/role (Admin only)
 */
router.put('/users/:userId/role', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ msg: 'Invalid role. Must be "user" or "admin"' });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ msg: 'Invalid user ID format' });
    }

    const user = await User.findByIdAndUpdate(userId, { role }, { new: true }).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(user);
  } catch (e) {
    next(e);
  }
});

/**
 * POST /api/auth/register
 */
router.post(
  '/register',
  [
    body('username').trim().isLength({ min: 3, max: 32 })
      .withMessage('Username must be 3-32 chars')
      .matches(/^[a-zA-Z0-9._-]+$/).withMessage('Username has invalid characters'),
    body('fullName').trim().isLength({ min: 3, max: 80 }).withMessage('Full name is too short'),
    body('email').trim().isEmail().withMessage('Valid email required').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 chars'),
    body('profilePhoto').optional().isString().withMessage('Profile photo must be a valid URL')
  ],
  handleValidation,
  async (req, res, next) => {
    try {
      const { username, fullName, email, password } = req.body;

      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);

      await User.create({
        username,
        fullName,
        email,
        password: hashed,
        role: 'user', // default
        profilePhoto: req.body.profilePhoto || null
      });

      return res.status(201).json({ msg: 'User registered successfully' });
    } catch (e) { next(e); }
  }
);

/**
 * POST /api/auth/login
 */
router.post(
  '/login',
  [
    body('password').exists().withMessage('Password is required'),
    body().custom(body => {
      if (!body.username && !body.email) {
        throw new Error('Username or email is required');
      }
      return true;
    })
  ],
  handleValidation,
  async (req, res, next) => {
    try {
      const { username, email, password } = req.body;

      const user = await User.findOne(
        username ? { username } : { email: (email || '').toLowerCase() }
      );
      if (!user) return res.status(400).json({ field: username ? 'username' : 'email', msg: 'Invalid credentials' });

      const ok = await bcrypt.compare(password, user.password);
      if (!ok) return res.status(400).json({ field: 'password', msg: 'Invalid credentials' });

      const payload = { id: user._id, role: user.role };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES || '1d' });

      return res.json({ token, user: user.toClient() });
    } catch (e) { next(e); }
  }
);

export default router;
