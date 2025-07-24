
const mongoose = require('mongoose');

const replaceExtendRequestSchema = new mongoose.Schema({
  contributor: {
    type: String,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  resourceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'uploads.files'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ReplaceExtendRequest', replaceExtendRequestSchema);
