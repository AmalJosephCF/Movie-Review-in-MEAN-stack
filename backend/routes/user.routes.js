import express from 'express';
import User from '../models/User.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/users/me
 * Authorization: Bearer <token>
 */
router.get('/users/me', requireAuth, async (req, res) => {
  const me = await User.findById(req.user.id);
  if (!me) return res.status(404).json({ msg: 'User not found' });
  return res.json(me.toClient());
});

/**
 * GET /api/admin/ping
 * Only admins
 */
router.get('/admin/ping', requireAuth, requireRole('admin'), (_req, res) => {
  res.json({ msg: 'Admin OK' });
});

export default router;
