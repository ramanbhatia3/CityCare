// backend/models/issueModel.js
const mongoose = require('mongoose');

const authorityUpdateSchema = mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
}, {
  timestamps: true,
});

const issueSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: [true, 'Please add a title'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
    },
    city: {
      type: String,
      required: [true, 'Please add a city'],
    },
    state: {
      type: String,
      required: [true, 'Please add a state'],
    },
    location: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    imageUrl: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: 'Open',
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    feedback: {
      type: String,
      trim: true,
    },
    volunteerRequest: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: null,
    },
    volunteer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    authorityUpdates: [authorityUpdateSchema],
  },
  {
    timestamps: true,
  }
);

const Issue = mongoose.model('Issue', issueSchema);

module.exports = Issue;