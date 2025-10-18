// backend/routes/issueRoutes.js
const express = require('express');
const router = express.Router();
const {
  getIssues,
  createIssue,
  updateIssueStatus,
  getMyIssues,
  getIssueById,
  addIssueFeedback,
  requestToVolunteer,
  getVolunteerRequests,
  manageVolunteerRequest,
  addAuthorityUpdate,
} = require('../controllers/issueController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/').get(getIssues).post(protect, upload.single('image'), createIssue);
router.route('/myissues').get(protect, getMyIssues);
router.route('/volunteer-requests').get(protect, admin, getVolunteerRequests);
router.route('/:id').get(getIssueById);
router.route('/:id/status').put(protect, admin, updateIssueStatus);
router.route('/:id/feedback').put(protect, addIssueFeedback);
router.route('/:id/volunteer').post(protect, requestToVolunteer);
router.route('/:id/volunteer/manage').put(protect, admin, manageVolunteerRequest);
router.route('/:id/update').post(protect, admin, upload.single('image'), addAuthorityUpdate);

module.exports = router;