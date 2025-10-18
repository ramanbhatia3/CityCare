// backend/controllers/adminController.js
const Issue = require('../models/issueModel');
const User = require('../models/userModel');

/**
 * @desc    Get dashboard statistics for the admin panel.
 * @route   GET /api/admin/stats
 * @access  Private/Admin
 */
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ isAdmin: false });
    const totalIssues = await Issue.countDocuments();
    const pendingVolunteers = await Issue.countDocuments({ volunteerRequest: 'Pending' });

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const resolvedLast30Days = await Issue.countDocuments({
      status: 'Resolved',
      updatedAt: { $gte: thirtyDaysAgo },
    });

    res.status(200).json({
      totalUsers,
      totalIssues,
      pendingVolunteers,
      resolvedLast30Days,
    });
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

module.exports = { getDashboardStats };