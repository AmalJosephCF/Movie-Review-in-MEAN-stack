import express from 'express';
import { body } from 'express-validator';
import handleValidation from '../middleware/handleValidation.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import Poster from '../models/Poster.js';
import Comment from '../models/Comment.js';

const router = express.Router();

/**
 * GET /api/posters
 * -> Get all approved posters (public)
 */
router.get('/', async (req, res, next) => {
  try {
    const { category, page = 1, limit = 12 } = req.query;
    const skip = (page - 1) * limit;

    let filter = { isApproved: true };
    if (category && category !== 'All') {
      filter.category = category;
    }

    const posters = await Poster.find(filter)
      .populate('author', 'username fullName profilePhoto')
      .populate('comments')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Poster.countDocuments(filter);

    res.json({
      posters,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        total,
        hasNext: skip + posters.length < total,
        hasPrev: page > 1
      }
    });
  } catch (e) {
    next(e);
  }
});

/**
 * GET /api/posters/pending
 * -> Get pending posters (admin only)
 */
router.get('/pending', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const posters = await Poster.find({ isApproved: false })
      .populate('author', 'username fullName profilePhoto')
      .sort({ createdAt: -1 });

    res.json(posters);
  } catch (e) {
    next(e);
  }
});

/**
 * GET /api/posters/all
 * -> Get ALL posters (admin only)
 */
router.get('/all', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const posters = await Poster.find()
      .populate('author', 'username fullName profilePhoto')
      .populate('comments')
      .sort({ createdAt: -1 });

    res.json(posters);
  } catch (e) {
    next(e);
  }
});

/**
 * GET /api/posters/my-posts
 * -> Get user's own posters
 */
router.get('/my-posts', requireAuth, async (req, res, next) => {
  try {
    const posters = await Poster.find({ author: req.user.id })
      .populate('author', 'username fullName profilePhoto')
      .populate('comments')
      .sort({ createdAt: -1 });

    res.json(posters);
  } catch (e) {
    next(e);
  }
});

/**
 * GET /api/posters/:id
 * -> Get specific poster with comments
 * ⚠️ Keep this LAST (catch-all for id)
 */
router.get('/:id', async (req, res, next) => {
  try {
    const poster = await Poster.findById(req.params.id)
      .populate('author', 'username fullName profilePhoto')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'username fullName profilePhoto'
        }
      });

    if (!poster) {
      return res.status(404).json({ msg: 'Poster not found' });
    }

    // Only show approved posters to non-admin users
    if (!poster.isApproved && (!req.user || req.user.role !== 'admin')) {
      return res.status(404).json({ msg: 'Poster not found' });
    }

    res.json(poster);
  } catch (e) {
    next(e);
  }
});

/**
 * POST /api/posters
 * -> Create new poster (logged in users)
 */
router.post(
  '/',
  requireAuth,
  [
    body('title').trim().isLength({ min: 1, max: 100 }).withMessage('Title is required (max 100 chars)'),
    body('movieName').trim().isLength({ min: 1, max: 100 }).withMessage('Movie name is required (max 100 chars)'),
    body('category').isIn([
      'Action',
      'Comedy',
      'Drama',
      'Horror',
      'Sci-Fi',
      'Romance',
      'Thriller',
      'Documentary',
      'Animation',
      'Other'
    ]).withMessage('Valid category required'),
    body('posterImage').notEmpty().withMessage('Poster image is required'),
    body('review').trim().isLength({ min: 10, max: 1000 }).withMessage('Review must be 10-1000 characters'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5')
  ],
  handleValidation,
  async (req, res, next) => {
    try {
      const poster = await Poster.create({
        ...req.body,
        author: req.user.id
      });

      const populatedPoster = await Poster.findById(poster._id)
        .populate('author', 'username fullName profilePhoto');

      res.status(201).json({
        msg: 'Poster submitted successfully! Waiting for admin approval.',
        poster: populatedPoster
      });
    } catch (e) {
      next(e);
    }
  }
);

/**
 * PUT /api/posters/:id/approve
 * -> Approve poster (admin only)
 */
router.put('/:id/approve', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const poster = await Poster.findByIdAndUpdate(
      req.params.id,
      {
        isApproved: true,
        approvedBy: req.user.id,
        approvedAt: new Date()
      },
      { new: true }
    ).populate('author', 'username fullName profilePhoto');

    if (!poster) {
      return res.status(404).json({ msg: 'Poster not found' });
    }

    res.json({
      msg: 'Poster approved successfully!',
      poster
    });
  } catch (e) {
    next(e);
  }
});

/**
 * PUT /api/posters/:id/reject
 * -> Reject poster (admin only)
 */
router.put('/:id/reject', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const poster = await Poster.findByIdAndDelete(req.params.id);

    if (!poster) {
      return res.status(404).json({ msg: 'Poster not found' });
    }

    // Also delete associated comments
    await Comment.deleteMany({ poster: req.params.id });

    res.json({ msg: 'Poster rejected and deleted successfully!' });
  } catch (e) {
    next(e);
  }
});

/**
 * DELETE /api/posters/:id
 * -> Delete own poster (users) or any poster (admin)
 */
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const poster = await Poster.findById(req.params.id);

    if (!poster) {
      return res.status(404).json({ msg: 'Poster not found' });
    }

    // Users can only delete their own posters, admins can delete any
    if (poster.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized to delete this poster' });
    }

    await Poster.findByIdAndDelete(req.params.id);
    await Comment.deleteMany({ poster: req.params.id });

    res.json({ msg: 'Poster deleted successfully!' });
  } catch (e) {
    next(e);
  }
});

export default router;
