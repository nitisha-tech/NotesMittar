<<<<<<< HEAD

const mongoose = require('mongoose');

const adminActionSchema = new mongoose.Schema({
  adminUsername: {
    type: String,
    required: true
  },
  targetUsername: {
    type: String,
    required: true
  },
  actionType: {
    type: String,
    enum: ['suspend', 'activate'],
    required: true
  },
  reason: {
    type: String,
    default: ''
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'adminactions' // Optional but makes the collection name consistent
});

module.exports = mongoose.model('AdminAction', adminActionSchema);
=======

const mongoose = require('mongoose');

const adminActionSchema = new mongoose.Schema({
  adminUsername: {
    type: String,
    required: true
  },
  targetUsername: {
    type: String,
    required: true
  },
  actionType: {
    type: String,
    enum: ['suspend', 'activate'],
    required: true
  },
  reason: {
    type: String,
    default: ''
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'adminactions' // Optional but makes the collection name consistent
});

module.exports = mongoose.model('AdminAction', adminActionSchema);
>>>>>>> 06c128c0d22097dd48c9533a353c8c3e39cc3bb8
