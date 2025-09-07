import express from 'express';
import { body } from 'express-validator';
import handleValidation from '../middleware/handleValidation.js';
import { requireAuth } from '../middleware/auth.js';
import Comment from '../models/Comment.js';
import Poster from '../models/Poster.js';

const router = express.Router();

/*
 * POST /api/comments
 * -> Add comment to poster (logged in users only)
 */
router.post('/', requireAuth, [
  body('content').trim().isLength({ min: 1, max: 500 }).withMessage('Comment must be 1-500 characters'),
  body('posterId').notEmpty().withMessage('Poster ID is required')
], handleValidation, async (req, res, next) => {
  try {
    const { content, posterId } = req.body;
    
    // Check if poster exists and is approved
    const poster = await Poster.findById(posterId);
    if (!poster) {
      return res.status(404).json({ msg: 'Poster not found' });
    }
    
    if (!poster.isApproved) {
      return res.status(400).json({ msg: 'Cannot comment on unapproved poster' });
    }
    
    const comment = await Comment.create({
      content,
      author: req.user.id,
      poster: posterId
    });
    
    // Add comment to poster's comments array
    await Poster.findByIdAndUpdate(posterId, {
      $push: { comments: comment._id }
    });
    
    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'username fullName profilePhoto');
    
    res.status(201).json({
      msg: 'Comment added successfully!',
      comment: populatedComment
    });
  } catch (e) {
    next(e);
  }
});

/**
 * PUT /api/comments/:id
 * -> Update own comment
 */
router.put('/:id', requireAuth, [
  body('content').trim().isLength({ min: 1, max: 500 }).withMessage('Comment must be 1-500 characters')
], handleValidation, async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }
    
    // Users can only edit their own comments
    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized to edit this comment' });
    }
    
    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      { content: req.body.content },
      { new: true }
    ).populate('author', 'username fullName profilePhoto');
    
    res.json({
      msg: 'Comment updated successfully!',
      comment: updatedComment
    });
  } catch (e) {
    next(e);
  }
});

/**
 * DELETE /api/comments/:id
 * -> Delete own comment or any comment (admin)
 */
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }
    
    // Users can only delete their own comments, admins can delete any
    if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized to delete this comment' });
    }
    
    // Remove comment from poster's comments array
    await Poster.findByIdAndUpdate(comment.poster, {
      $pull: { comments: comment._id }
    });
    
    await Comment.findByIdAndDelete(req.params.id);
    
    res.json({ msg: 'Comment deleted successfully!' });
  } catch (e) {
    next(e);
  }
});

/**
 * POST /api/comments/:id/like
 * -> Like/unlike comment
 */
router.post('/:id/like', requireAuth, async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }
    
    const userId = req.user.id;
    const isLiked = comment.likes.includes(userId);
    
    if (isLiked) {
      // Unlike
      comment.likes = comment.likes.filter(id => id.toString() !== userId);
    } else {
      // Like
      comment.likes.push(userId);
    }
    
    await comment.save();
    
    res.json({
      msg: isLiked ? 'Comment unliked!' : 'Comment liked!',
      likes: comment.likes.length,
      isLiked: !isLiked
    });
  } catch (e) {
    next(e);
  }
});

export default router;
