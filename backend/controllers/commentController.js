// backend/controllers/commentController.js
const Comment = require('../models/commentModel');
const Issue = require('../models/issueModel');

/**
 * @desc    Get all comments for a specific issue.
 * @route   GET /api/comments/:issueId
 * @access  Public
 */
const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ issue: req.params.issueId })
      .populate('user', 'name')
      .sort({ createdAt: 'desc' });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * @desc    Create a new comment on an issue.
 * @route   POST /api/comments/:issueId
 * @access  Private
 */
const createComment = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.issueId);
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    const comment = new Comment({
      text: req.body.text,
      user: req.user.id,
      issue: req.params.issueId,
    });

    const createdComment = await comment.save();
    res.status(201).json(createdComment);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getComments, createComment };