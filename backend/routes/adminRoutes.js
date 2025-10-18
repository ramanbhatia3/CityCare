// backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.use(protect, admin);
router.route('/stats').get(getDashboardStats);

module.exports = router;