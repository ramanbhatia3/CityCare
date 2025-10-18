// backend/routes/commentRoutes.js
const express = require('express');
const router = express.Router();
const { getComments, createComment } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

router.route('/:issueId').get(getComments);
router.route('/:issueId').post(protect, createComment);

module.exports = router;