// backend/controllers/issueController.js
const Issue = require('../models/issueModel');
const User = require('../models/userModel');
const sendEmail = require('../utils/sendEmail');

const getIssues = async (req, res) => {
  try {
    const issues = await Issue.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    res.status(200).json(issues);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

const createIssue = async (req, res) => {
  const { title, description, category, latitude, longitude, city, state } = req.body;

  const imageUrl = `${req.protocol}://${req.get('host')}/${req.file.path.replace(/\\/g, "/")}`;
  const location = { latitude, longitude };

  if (!title || !description || !category || !location || !imageUrl || !city || !state) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    const issue = await Issue.create({
      title, description, category, location, imageUrl, city, state,
      user: req.user.id,
    });

    await sendEmail({
      to: req.user.email,
      subject: `Issue Reported: "${issue.title}"`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Thank you for your submission!</h2>
          <p>Your civic issue, titled "<strong>${issue.title}</strong>", has been successfully reported.</p>
          <p>You can track its status in the "My Profile" section of your CityCare account.</p>
          <p>Thank you for helping improve our community.</p>
        </div>
      `,
    });

    res.status(201).json(issue);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

const updateIssueStatus = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (issue) {
      issue.status = req.body.status || issue.status;
      const updatedIssue = await issue.save();
      res.json(updatedIssue);
    } else {
      res.status(404).json({ message: 'Issue not found' });
    }
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

const getMyIssues = async (req, res) => {
  try {
    const issues = await Issue.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

const getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id).populate('user', 'name email').populate('authorityUpdates.updatedBy', 'name');
    if (issue) {
      res.json(issue);
    } else {
      res.status(404).json({ message: 'Issue not found' });
    }
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

const addIssueFeedback = async (req, res) => {
  const { rating, feedback } = req.body;
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) { return res.status(404).json({ message: 'Issue not found' }); }
    if (issue.user.toString() !== req.user._id.toString()) { return res.status(401).json({ message: 'User not authorized' }); }
    if (issue.status !== 'Resolved') { return res.status(400).json({ message: 'Feedback can only be added to resolved issues' }); }
    if (issue.rating) { return res.status(400).json({ message: 'Feedback has already been submitted for this issue' }); }
    issue.rating = Number(rating);
    issue.feedback = feedback;
    const updatedIssue = await issue.save();
    res.status(200).json(updatedIssue);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

const requestToVolunteer = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) { return res.status(404).json({ message: 'Issue not found' }); }
    if (issue.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized for this issue' });
    }
    if (issue.volunteerRequest) {
      return res.status(400).json({ message: 'A volunteer request has already been made' });
    }
    issue.volunteerRequest = 'Pending';
    await issue.save();
    res.status(200).json({ message: 'Volunteer request submitted successfully.' });
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

const getVolunteerRequests = async (req, res) => {
  try {
    const requests = await Issue.find({ volunteerRequest: 'Pending' })
      .populate('user', 'name email')
      .sort({ createdAt: 'desc' });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

const manageVolunteerRequest = async (req, res) => {
  const { decision } = req.body;
  if (!['Approved', 'Rejected'].includes(decision)) {
    return res.status(400).json({ message: 'Invalid decision provided' });
  }
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue || issue.volunteerRequest !== 'Pending') {
      return res.status(404).json({ message: 'No pending volunteer request' });
    }
    issue.volunteerRequest = decision;
    if (decision === 'Approved') {
      issue.volunteer = issue.user;
    }
    const updatedIssue = await issue.save();
    res.status(200).json(updatedIssue);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

const addAuthorityUpdate = async (req, res) => {
  const { text } = req.body;
  if (!text) { return res.status(400).json({ message: 'Update text is required' }); }
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) { return res.status(404).json({ message: 'Issue not found' }); }
    const newUpdate = { text, updatedBy: req.user.id };
    if (req.file) {
      newUpdate.imageUrl = `${req.protocol}://${req.get('host')}/${req.file.path.replace(/\\/g, "/")}`;
    }
    issue.authorityUpdates.push(newUpdate);
    await issue.save();
    const populatedIssue = await Issue.findById(issue._id).populate('authorityUpdates.updatedBy', 'name');
    res.status(201).json(populatedIssue);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

module.exports = {
  getIssues, createIssue, updateIssueStatus, getMyIssues, getIssueById, addIssueFeedback,
  requestToVolunteer, getVolunteerRequests, manageVolunteerRequest, addAuthorityUpdate,
};